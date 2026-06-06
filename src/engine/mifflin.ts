// Mifflin-St Jeor BMR + TDEE — ported from onboarding_nutrition.py
import { ACTIVITY_MULTIPLIERS, lbsToKg, type Sex } from './constants'

/** BMR in kcal/day. Ported from mifflin_st_jeor_bmr_kcal (clamps included). */
export function mifflinBmrKcal(opts: {
  sex: Sex
  age: number
  weightKg: number
  heightCm: number
}): number {
  const isFemale = opts.sex === 'Female'
  const a = Math.max(14, Math.min(100, Math.round(opts.age)))
  const w = Math.max(20.0, Math.min(300.0, opts.weightKg))
  const h = Math.max(100.0, Math.min(250.0, opts.heightCm))
  if (isFemale) return 10.0 * w + 6.25 * h - 5.0 * a - 161.0
  return 10.0 * w + 6.25 * h - 5.0 * a + 5.0
}

export function activityMultiplier(level: string): number {
  return ACTIVITY_MULTIPLIERS[level] ?? ACTIVITY_MULTIPLIERS.moderate
}

/** Static Mifflin TDEE seed = BMR × activity factor, at a given bodyweight. */
export function tdeeKcal(opts: {
  sex: Sex
  age: number
  weightLb: number
  heightCm: number
  activity: string
}): number {
  const bmr = mifflinBmrKcal({
    sex: opts.sex,
    age: opts.age,
    weightKg: lbsToKg(opts.weightLb),
    heightCm: opts.heightCm,
  })
  return bmr * activityMultiplier(opts.activity)
}
