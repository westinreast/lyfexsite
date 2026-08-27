import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { runForecast } from '../engine/forecast'
import type { Sex } from '../engine/constants'
import { Aurora } from '../theme/aurora'
import { GlassCard, Pill, SegToggle, Slider, Stat } from './ui'
import { areaPath, linePath, linScale, niceBounds, smoothPath, type Pt } from './chart'

// Chart geometry (SVG user units; rendered responsive via viewBox).
const W = 760
const H = 360
const M = { l: 46, r: 54, t: 26, b: 38 }
const PX0 = M.l
const PX1 = W - M.r
const PY0 = M.t
const PY1 = H - M.b

export function PlayableEngine() {
  const [start, setStart] = useState(230)
  const [goal, setGoal] = useState(185)
  const [pace, setPace] = useState(2.5)
  const [sex, setSex] = useState<Sex>('Male')
  const [age, setAge] = useState(32)
  const [heightCm, setHeightCm] = useState(178)
  const [activity, setActivity] = useState('moderate')

  const fc = useMemo(
    () =>
      runForecast({
        startWeightLb: start,
        goalWeightLb: goal,
        chosenPaceLbWk: pace,
        sex,
        age,
        heightCm,
        activity,
      }),
    [start, goal, pace, sex, age, heightCm, activity],
  )

  const weeks = fc.weeks
  const lastWeek = weeks[weeks.length - 1].week
  const xs = linScale([0, Math.max(1, lastWeek)], [PX0, PX1])

  const allW = weeks.flatMap((w) => [w.weightLb, w.requestedLb, goal])
  const [wMin, wMax] = niceBounds(Math.min(...allW), Math.max(...allW))
  const ys = linScale([wMin, wMax], [PY1, PY0])

  // secondary scale for the adapting daily target (kcal)
  const allK = weeks.map((w) => w.targetKcal)
  const [kMin, kMax] = niceBounds(Math.min(...allK), Math.max(...allK), 0.2)
  const yk = linScale([kMin, kMax], [PY1, PY0])

  const safePts: Pt[] = weeks.map((w) => ({ x: xs(w.week), y: ys(w.weightLb) }))
  const reqPts: Pt[] = weeks.map((w) => ({ x: xs(w.week), y: ys(w.requestedLb) }))
  const kcalPts: Pt[] = weeks.map((w) => ({ x: xs(w.week), y: yk(w.targetKcal) }))

  const goalY = ys(goal)
  const dir = fc.direction
  const cap0 = weeks[0].capLbWk
  const effPace0 = Math.min(pace, cap0)
  const capActive = fc.everCapped && dir !== 'maintain'

  const yTicks = makeTicks(wMin, wMax, 4)
  const xTicks = makeTicks(0, lastWeek, Math.min(6, lastWeek)).filter((t) => t > 0)

  const fmtWeeks = (w: number | null) =>
    w == null ? '—' : w >= 52 ? `${(w / 52).toFixed(1)} yr` : `${w} wk`

  return (
    <section id="engine" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mb-8 text-center">
        <Pill tone="violet">⚡ The Playable Engine · runs entirely in your browser</Pill>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-aurora-textPrimary md:text-4xl">
          Drag your goal. Watch the engine answer.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-aurora-textSecondary">
          This is the actual LyfeX forecasting math — Mifflin TDEE, the safety cap, energy balance —
          ported to run live, with <span className="text-aurora-textPrimary">zero server calls</span>.
          Pick an unsafe pace and watch the cap bite.
        </p>
      </div>

      <GlassCard strong className="overflow-hidden p-5 md:p-7">
        <div className="grid gap-7 lg:grid-cols-[1.55fr_1fr]">
          {/* ── Chart ───────────────────────────────────────────────── */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-aurora-textSecondary">
              <LegendDot color={Aurora.violet} label="Safe trajectory" />
              {capActive && <LegendDot color={Aurora.rose} label="What you asked for" dashed />}
              <LegendDot color={Aurora.mint} label="Goal" dashed />
              <LegendDot color={Aurora.amber} label="Daily target (kcal)" dashed thin />
            </div>

            <div className="relative">
              {capActive && (
                <div className="absolute right-2 top-2 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-rose/50 bg-aurora-rose/15 px-3 py-1 text-xs font-bold text-aurora-rose shadow-float">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora-rose" />
                    SAFETY CAP ENGAGED
                  </span>
                </div>
              )}
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Weight forecast chart">
                <defs>
                  <linearGradient id="safeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={Aurora.violet} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={Aurora.violet} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* gridlines + y labels (weight) */}
                {yTicks.map((t) => (
                  <g key={`y${t}`}>
                    <line x1={PX0} x2={PX1} y1={ys(t)} y2={ys(t)} stroke={Aurora.borderHair} strokeWidth={1} />
                    <text x={PX0 - 8} y={ys(t) + 4} textAnchor="end" fontSize="11" fill={Aurora.textTertiary}>
                      {Math.round(t)}
                    </text>
                  </g>
                ))}
                {/* x labels (weeks) */}
                {xTicks.map((t) => (
                  <text key={`x${t}`} x={xs(t)} y={H - 14} textAnchor="middle" fontSize="11" fill={Aurora.textTertiary}>
                    {Math.round(t)}w
                  </text>
                ))}
                <text x={PX0 - 8} y={PY0 - 10} textAnchor="end" fontSize="10" fill={Aurora.textTertiary}>
                  lb
                </text>
                <text x={(PX0 + PX1) / 2} y={H - 1} textAnchor="middle" fontSize="10" fill={Aurora.textTertiary}>
                  weeks from today
                </text>

                {/* goal line */}
                <line
                  x1={PX0}
                  x2={PX1}
                  y1={goalY}
                  y2={goalY}
                  stroke={Aurora.mint}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  opacity={0.8}
                />

                {/* adapting daily-target (kcal) — secondary axis, thin amber.
                    Straight segments, not smoothed: the jump to maintenance at
                    goal-arrival is a real step, and Catmull-Rom smoothing turns
                    it into an overshooting spike that reads as a glitch. */}
                <path d={linePath(kcalPts)} fill="none" stroke={Aurora.amber} strokeWidth={1.4} strokeDasharray="3 4" opacity={0.65} />

                {/* requested (uncapped) ghost */}
                {capActive && (
                  <path d={smoothPath(reqPts)} fill="none" stroke={Aurora.rose} strokeWidth={2} strokeDasharray="6 5" opacity={0.85} />
                )}

                {/* safe trajectory: area + animated line */}
                <path d={areaPath(safePts, PY1)} fill="url(#safeFill)" />
                <motion.path
                  key={`${start}-${goal}-${pace}-${sex}-${age}-${heightCm}-${activity}`}
                  d={smoothPath(safePts)}
                  fill="none"
                  stroke={Aurora.violet}
                  strokeWidth={3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 6px ${Aurora.violet}aa)` }}
                />
                {/* endpoint marker */}
                <circle cx={safePts[safePts.length - 1].x} cy={safePts[safePts.length - 1].y} r={4.5} fill={Aurora.violetBright} stroke={Aurora.bg} strokeWidth={2} />
                <circle cx={safePts[0].x} cy={safePts[0].y} r={4} fill={Aurora.violet} stroke={Aurora.bg} strokeWidth={2} />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Reaches goal" value={fmtWeeks(fc.weeksToGoal)} accent={Aurora.mint} />
              <Stat
                label="Safe pace now"
                value={`${effPace0.toFixed(1)}`}
                sub="lb / week"
                accent={capActive ? Aurora.rose : Aurora.violetBright}
              />
              <Stat
                label="Daily target"
                value={fc.startTarget.toLocaleString()}
                sub={`→ ${fc.endTarget.toLocaleString()} kcal`}
                accent={Aurora.amber}
              />
              <Stat
                label="TDEE adapts"
                value={Math.round(fc.startTdee).toLocaleString()}
                sub={`→ ${Math.round(fc.endTdee).toLocaleString()} kcal`}
                accent={Aurora.cyan}
              />
            </div>
          </div>

          {/* ── Controls ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <Slider
              label="Current weight"
              value={start}
              min={110}
              max={400}
              step={1}
              unit="lb"
              onChange={setStart}
              accent={Aurora.violetBright}
            />
            <Slider
              label="Goal weight"
              value={goal}
              min={100}
              max={390}
              step={1}
              unit="lb"
              onChange={setGoal}
              accent={Aurora.mint}
            />
            <Slider
              label="Chosen pace"
              value={pace}
              min={0.5}
              max={4}
              step={0.1}
              unit="lb/wk"
              onChange={setPace}
              format={(v) => v.toFixed(1)}
              accent={capActive ? Aurora.rose : Aurora.violetBright}
            />

            <div className="rounded-xl border border-aurora-borderHair bg-aurora-bg/40 p-4">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-aurora-textTertiary">
                Your stats — these drive real TDEE
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-aurora-textSecondary">Sex</span>
                  <SegToggle
                    value={sex}
                    onChange={setSex}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                  />
                </div>
                <Slider label="Age" value={age} min={16} max={80} step={1} unit="yr" onChange={setAge} accent={Aurora.cyan} />
                <Slider
                  label="Height"
                  value={heightCm}
                  min={140}
                  max={210}
                  step={1}
                  onChange={setHeightCm}
                  format={(v) => `${Math.floor(v / 30.48)}'${Math.round((v % 30.48) / 2.54)}"`}
                  accent={Aurora.cyan}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-aurora-textSecondary">Activity</span>
                  <SegToggle
                    value={activity}
                    onChange={setActivity}
                    options={[
                      { value: 'sedentary', label: 'Low' },
                      { value: 'moderate', label: 'Mod' },
                      { value: 'very', label: 'High' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-aurora-textTertiary">
              The cap is{' '}
              <span className="text-aurora-textSecondary">max(2 lb/wk, 1% of bodyweight)</span> — so it
              tightens as you get lighter. Same formula the app uses to keep you from torching muscle.
            </p>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}

function LegendDot({ color, label, dashed, thin }: { color: string; label: string; dashed?: boolean; thin?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="22" height="8">
        <line
          x1="0"
          y1="4"
          x2="22"
          y2="4"
          stroke={color}
          strokeWidth={thin ? 1.4 : 2.5}
          strokeDasharray={dashed ? '4 3' : undefined}
          strokeLinecap="round"
        />
      </svg>
      {label}
    </span>
  )
}

function makeTicks(min: number, max: number, count: number): number[] {
  if (count <= 0 || min === max) return [min]
  const step = (max - min) / count
  return Array.from({ length: count + 1 }, (_, i) => min + step * i)
}
