// 2-state (level, trend) Kalman local-linear-trend filter.
// Ported 1:1 from fueling/axes/trend_filters.py :: compute_rate_kalman.
// This is the real estimator LyfeX uses to draw the true weight trend through
// noisy daily weigh-ins and report a rate-of-change with honest uncertainty.
import { KF_Q, KF_R, KF_TREND_PRIOR_STD } from './constants'

export interface WeighIn {
  /** day index (integer days from an arbitrary epoch) */
  day: number
  /** measured weight in lb */
  lb: number
}

export interface KalmanState {
  day: number
  /** filtered (true) level estimate in lb */
  level: number
  /** filtered trend in lb/day */
  trend: number
  /** posterior level variance */
  levelVar: number
}

export interface KalmanResult {
  /** smoothed level path, one point per processed weigh-in */
  path: KalmanState[]
  /** rate of change in lb/week (trend × 7) at the last point */
  rateLbPerWeek: number
  /** 1-sigma uncertainty of the rate in lb/week */
  stdLbPerWeek: number
}

/**
 * Run the local-linear-trend Kalman filter over timestamped weigh-ins.
 * Mirrors the Python implementation step-for-step (predict over dt days, then
 * scalar update with the new measurement). `asOfDay` optionally extrapolates the
 * trend uncertainty to "now" when the last weigh-in is stale.
 */
export function computeRateKalman(weighIns: WeighIn[], asOfDay?: number): KalmanResult | null {
  // collapse to one weigh-in per day (last wins), then sort
  const byDay = new Map<number, number>()
  for (const w of weighIns) byDay.set(w.day, w.lb)
  const pts = [...byDay.entries()].sort((a, b) => a[0] - b[0])
  if (pts.length < 2) return null

  // state x = [level, trend(lb/day)]; covariance P (2x2)
  let level = pts[0][1]
  let trend = 0.0
  let p00 = KF_R
  let p01 = 0.0
  let p10 = 0.0
  let p11 = KF_TREND_PRIOR_STD ** 2
  let prev = pts[0][0]

  const path: KalmanState[] = [{ day: prev, level, trend, levelVar: p00 }]

  for (let i = 1; i < pts.length; i++) {
    const [d, z] = pts[i]
    const dt = (d - prev) || 1.0
    prev = d
    // --- predict over dt days ---
    level = level + trend * dt
    const a = p00 + dt * p10 + dt * p01 + dt * dt * p11
    const b = p01 + dt * p11
    const c = p10 + dt * p11
    const d11 = p11
    const q = KF_Q
    p00 = a + (q * dt ** 3) / 3.0
    p01 = b + (q * dt ** 2) / 2.0
    p10 = c + (q * dt ** 2) / 2.0
    p11 = d11 + q * dt
    // --- update with weigh-in z ---
    const y = z - level
    const s = p00 + KF_R
    const k0 = p00 / s
    const k1 = p10 / s
    level = level + k0 * y
    trend = trend + k1 * y
    const np00 = (1.0 - k0) * p00
    const np01 = (1.0 - k0) * p01
    const np10 = p10 - k1 * p00
    const np11 = p11 - k1 * p01
    p00 = np00
    p01 = np01
    p10 = np10
    p11 = np11
    path.push({ day: d, level, trend, levelVar: p00 })
  }

  if (asOfDay !== undefined) {
    const gap = asOfDay - pts[pts.length - 1][0]
    if (gap > 0) p11 = p11 + KF_Q * gap
  }

  const rate = trend * 7.0
  const std = Math.sqrt(Math.max(0.0, p11)) * 7.0
  return { path, rateLbPerWeek: rate, stdLbPerWeek: std }
}
