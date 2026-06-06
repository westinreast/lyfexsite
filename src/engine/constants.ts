// ─────────────────────────────────────────────────────────────────────────
// Engine constants — copied 1:1 from the LyfeX Python engine so the website's
// math is the REAL math, not a marketing approximation.
//   fueling/axes/acute.py        (safety caps, energy density, observed TDEE)
//   fueling/axes/trend_filters.py (Kalman tunables)
//   onboarding_nutrition.py       (Mifflin, activity multipliers, floors)
// ─────────────────────────────────────────────────────────────────────────

export const LB_PER_KG = 2.2046226218
export const KG_PER_LB = 0.45359237
export const KCAL_PER_LB = 3500.0 // _KCAL_PER_LB
export const KCAL_PER_KG = 7700.0 // _KCAL_PER_KG — energy density of bodyweight

// Safety pace caps (acute.py): loss = max(2 lb/wk, 1% BW); gain = min(1 lb/wk, 0.5% BW)
export const SAFE_LOSS_FLAT_LB = 2.0
export const SAFE_LOSS_PCT_BW = 0.01
export const SAFE_GAIN_FLAT_LB = 1.0
export const SAFE_GAIN_PCT_BW = 0.005

// Mifflin-St Jeor activity multipliers (onboarding_nutrition.py ACTIVITY_MULTIPLIERS)
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
}

// Kalman local-linear-trend tunables (trend_filters.py — fit to real weigh-in noise)
export const KF_R = 0.85 // measurement-noise variance (lb²)
export const KF_Q = 1.2e-4 // trend process-noise rate (lb²/day³)
export const KF_TREND_PRIOR_STD = 0.15 // lb/day (~1 lb/wk) initial trend uncertainty

export type Sex = 'Male' | 'Female'
export type Direction = 'lose' | 'gain' | 'maintain'

export function lbsToKg(lbs: number): number {
  return Math.max(0, lbs) * KG_PER_LB
}

// min_safe_calories(sex): 1200 female, 1500 male
export function minSafeCalories(sex: Sex): number {
  return sex === 'Female' ? 1200 : 1500
}
