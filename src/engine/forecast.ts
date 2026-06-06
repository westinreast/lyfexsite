// Playable Engine forecast — a weekly closed-loop simulation built on the real
// LyfeX engine pieces:
//   • Mifflin TDEE re-computed every week as bodyweight changes (TDEE adapting),
//   • the safety cap max(2 lb/wk, 1% BW) re-evaluated every week (it tightens as
//     you get lighter — the cap visibly biting),
//   • the daily calorie target = TDEE + pace_delta, where the deficit/surplus is
//     bounded by the clamped pace (KCAL_PER_LB energy density),
//   • a taper near the goal so the curve converges instead of overshooting.
//
// Nothing here calls a network or an LLM. It is deterministic math.
import { KCAL_PER_LB, minSafeCalories, type Direction, type Sex } from './constants'
import { tdeeKcal } from './mifflin'
import { clampPaceToSafety, safetyMaxPace } from './safety'

export interface ForecastInput {
  startWeightLb: number
  goalWeightLb: number
  /** chosen weekly pace MAGNITUDE in lb/wk (always positive; direction inferred) */
  chosenPaceLbWk: number
  sex: Sex
  age: number
  heightCm: number
  activity: string
  /** safety guard on the horizon */
  maxWeeks?: number
}

export interface ForecastWeek {
  week: number
  /** safe (engine-targeted) weight trajectory */
  weightLb: number
  /** naive "what you asked for" trajectory, ignoring the safety cap */
  requestedLb: number
  /** adapting Mifflin TDEE at this week's bodyweight */
  tdeeKcal: number
  /** prescribed daily calorie target (TDEE + clamped pace delta), floored */
  targetKcal: number
  /** this week's safety cap magnitude (lb/wk) at current bodyweight */
  capLbWk: number
  /** clamped pace actually applied this week (signed) */
  effPaceLbWk: number
  capped: boolean
}

export interface ForecastResult {
  weeks: ForecastWeek[]
  direction: Direction
  weeksToGoal: number | null
  /** total weight to move (lb, signed) */
  totalDeltaLb: number
  startTdee: number
  endTdee: number
  startTarget: number
  endTarget: number
  /** was the chosen pace ever clamped over the run */
  everCapped: boolean
}

export function runForecast(input: ForecastInput): ForecastResult {
  const maxWeeks = input.maxWeeks ?? 130 // ~2.5y horizon guard
  const start = input.startWeightLb
  const goal = input.goalWeightLb
  const dir: Direction = goal < start ? 'lose' : goal > start ? 'gain' : 'maintain'
  const sign = dir === 'lose' ? -1 : dir === 'gain' ? 1 : 0
  const floor = minSafeCalories(input.sex)

  const weeks: ForecastWeek[] = []
  let w = start
  let req = start // requested (uncapped) trajectory
  let everCapped = false
  let weeksToGoal: number | null = null

  const tdeeAt = (weight: number) =>
    tdeeKcal({
      sex: input.sex,
      age: input.age,
      weightLb: weight,
      heightCm: input.heightCm,
      activity: input.activity,
    })

  // week 0 snapshot
  const cap0 = safetyMaxPace(start, dir)
  const tdee0 = tdeeAt(start)
  weeks.push({
    week: 0,
    weightLb: start,
    requestedLb: start,
    tdeeKcal: tdee0,
    targetKcal: clampTarget(tdee0, sign, Math.min(input.chosenPaceLbWk, cap0), floor),
    capLbWk: cap0,
    effPaceLbWk: 0,
    capped: input.chosenPaceLbWk > cap0 + 1e-9 && dir !== 'maintain',
  })

  if (dir === 'maintain') {
    return finalize(weeks, dir, null, 0, tdee0, tdee0, weeks[0].targetKcal, weeks[0].targetKcal, false)
  }

  for (let week = 1; week <= maxWeeks; week++) {
    // re-evaluate the safety cap at the CURRENT bodyweight (it tightens as you
    // get lighter on a loss, e.g. 2.5 lb/wk at 250 → 2.0 lb/wk at 200).
    const clamp = clampPaceToSafety(sign * input.chosenPaceLbWk, w)
    const cap = clamp.capLbPerWeek
    if (clamp.isCapped) everCapped = true

    // taper near the goal so the curve converges (don't overshoot)
    const remaining = goal - w
    let step = clamp.cappedLbPerWeek // signed lb this week
    if (Math.abs(step) > Math.abs(remaining)) step = remaining

    // requested (uncapped) trajectory for the "what you asked for" ghost line
    const reqRemaining = goal - req
    let reqStep = sign * input.chosenPaceLbWk
    if (Math.abs(reqStep) > Math.abs(reqRemaining)) reqStep = reqRemaining

    w = w + step
    req = req + reqStep

    const tdee = tdeeAt(w)
    const target = clampTarget(tdee, sign, Math.abs(step), floor)

    weeks.push({
      week,
      weightLb: w,
      requestedLb: req,
      tdeeKcal: tdee,
      targetKcal: target,
      capLbWk: cap,
      effPaceLbWk: step,
      capped: clamp.isCapped,
    })

    if (weeksToGoal === null && Math.abs(goal - w) < 0.05) {
      weeksToGoal = week
      // run a few extra weeks of flat maintenance so the chart shows arrival
      const tail = Math.min(6, maxWeeks - week)
      for (let t = 1; t <= tail; t++) {
        const tt = tdeeAt(w)
        weeks.push({
          week: week + t,
          weightLb: w,
          requestedLb: goal,
          tdeeKcal: tt,
          targetKcal: Math.round(tt),
          capLbWk: safetyMaxPace(w, dir),
          effPaceLbWk: 0,
          capped: false,
        })
      }
      break
    }
  }

  const last = weeks[weeks.length - 1]
  return finalize(
    weeks,
    dir,
    weeksToGoal,
    goal - start,
    tdee0,
    last.tdeeKcal,
    weeks[0].targetKcal,
    last.targetKcal,
    everCapped,
  )
}

/** target = TDEE + signed pace delta (kcal/day), floored at the safe minimum. */
function clampTarget(tdee: number, sign: number, paceMagLbWk: number, floor: number): number {
  const deltaPerDay = (sign * paceMagLbWk * KCAL_PER_LB) / 7.0
  return Math.max(floor, Math.round(tdee + deltaPerDay))
}

function finalize(
  weeks: ForecastWeek[],
  direction: Direction,
  weeksToGoal: number | null,
  totalDeltaLb: number,
  startTdee: number,
  endTdee: number,
  startTarget: number,
  endTarget: number,
  everCapped: boolean,
): ForecastResult {
  return {
    weeks,
    direction,
    weeksToGoal,
    totalDeltaLb,
    startTdee,
    endTdee,
    startTarget,
    endTarget,
    everCapped,
  }
}
