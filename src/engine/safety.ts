// Safety pace caps — ported 1:1 from acute.py
//   loss ceiling  = max(2 lb/wk, 1% bodyweight/wk)
//   gain ceiling  = min(1 lb/wk, 0.5% bodyweight/wk)   (biological asymmetry)
import {
  SAFE_GAIN_FLAT_LB,
  SAFE_GAIN_PCT_BW,
  SAFE_LOSS_FLAT_LB,
  SAFE_LOSS_PCT_BW,
  type Direction,
} from './constants'

/** safety_max_pace_lb_per_week — safe maximum |weekly change| for a direction. */
export function safetyMaxPace(bodyweightLb: number, direction: Direction): number {
  const bw = Math.max(0, bodyweightLb || 0)
  if (direction === 'gain') {
    return bw > 0 ? Math.min(SAFE_GAIN_FLAT_LB, SAFE_GAIN_PCT_BW * bw) : SAFE_GAIN_FLAT_LB
  }
  return Math.max(SAFE_LOSS_FLAT_LB, SAFE_LOSS_PCT_BW * bw)
}

export interface ClampResult {
  cappedLbPerWeek: number
  isCapped: boolean
  capLbPerWeek: number
}

/** clamp_pace_to_safety — preserves sign, clamps magnitude to the ceiling. */
export function clampPaceToSafety(targetLbPerWeek: number, bodyweightLb: number): ClampResult {
  const t = targetLbPerWeek || 0
  if (t < 0) {
    const cap = safetyMaxPace(bodyweightLb, 'lose')
    const capped = Math.max(t, -cap)
    return { cappedLbPerWeek: capped, isCapped: Math.abs(capped) < Math.abs(t) - 1e-9, capLbPerWeek: cap }
  }
  if (t > 0) {
    const cap = safetyMaxPace(bodyweightLb, 'gain')
    const capped = Math.min(t, cap)
    return { cappedLbPerWeek: capped, isCapped: Math.abs(capped) < Math.abs(t) - 1e-9, capLbPerWeek: cap }
  }
  return { cappedLbPerWeek: 0, isCapped: false, capLbPerWeek: 0 }
}
