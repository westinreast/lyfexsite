// Deterministic noisy weigh-in generator for the "Signal through noise" demo.
// Seeded so the scatter is stable across renders (no RNG flicker), modelling the
// real day-to-day water/glycogen swing (~±1.5 lb) around a true downward trend.
import type { WeighIn } from './kalman'

/** Mulberry32 — tiny deterministic PRNG so every visitor sees the same chaos. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller normal from two uniforms. */
function gaussian(rnd: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = rnd()
  while (v === 0) v = rnd()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

export interface NoiseSeries {
  weighIns: WeighIn[]
  /** the hidden ground-truth trend (lb/wk) the visitor is trying to see */
  trueRateLbWk: number
}

/**
 * Build `days` of daily weigh-ins on a true linear trend, corrupted by daily
 * water/glycogen noise: an iid Gaussian (sd = noiseLb) plus a small FAST jitter
 * (period ~2.5 days — a sodium/carb day) so the scatter looks like real life.
 * Both are essentially trend-free, so the Kalman filter rejects them and
 * recovers the underlying rate — which is exactly the point of the demo.
 */
export function makeNoisySeries(opts: {
  startLb: number
  trueRateLbWk: number
  days: number
  noiseLb?: number
  seed?: number
}): NoiseSeries {
  const noiseLb = opts.noiseLb ?? 1.4
  const rnd = mulberry32(opts.seed ?? 1337)
  const perDay = opts.trueRateLbWk / 7.0
  const weighIns: WeighIn[] = []
  for (let day = 0; day < opts.days; day++) {
    const trueLevel = opts.startLb + perDay * day
    // fast jitter (~2.5d period) scaled by the noise dial — trend-free, so the
    // filter sees through it; only adds visual realism to the scatter.
    const jitter = 0.35 * noiseLb * Math.sin(day * 2.5)
    const lb = trueLevel + gaussian(rnd) * noiseLb + jitter
    weighIns.push({ day, lb: Math.round(lb * 10) / 10 })
  }
  return { weighIns, trueRateLbWk: opts.trueRateLbWk }
}
