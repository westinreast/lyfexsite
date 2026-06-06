import { useMemo, useState } from 'react'
import { computeRateKalman } from '../engine/kalman'
import { makeNoisySeries } from '../engine/noise'
import { Aurora } from '../theme/aurora'
import { GlassCard, Pill, Slider, Stat } from './ui'
import { areaPath, linePath, linScale, niceBounds, smoothPath, type Pt } from './chart'

const W = 760
const H = 340
const M = { l: 46, r: 22, t: 24, b: 36 }
const PX0 = M.l
const PX1 = W - M.r
const PY0 = M.t
const PY1 = H - M.b

const TOTAL_DAYS = 90
const TRUE_RATE = -1.1 // lb/wk hidden truth
const START_LB = 198

export function SignalNoise() {
  const [reveal, setReveal] = useState(58)
  const [noise, setNoise] = useState(1.5)

  const series = useMemo(
    () => makeNoisySeries({ startLb: START_LB, trueRateLbWk: TRUE_RATE, days: TOTAL_DAYS, noiseLb: noise, seed: 7 }),
    [noise],
  )

  const revealedN = Math.max(2, Math.round(reveal))
  const revealed = series.weighIns.slice(0, revealedN)
  const kf = useMemo(() => computeRateKalman(revealed, revealedN - 1), [revealed, revealedN])

  const allLb = series.weighIns.map((w) => w.lb)
  const [yMin, yMax] = niceBounds(Math.min(...allLb), Math.max(...allLb))
  const xs = linScale([0, TOTAL_DAYS - 1], [PX0, PX1])
  const ys = linScale([yMin, yMax], [PY1, PY0])

  const trendPts: Pt[] = (kf?.path ?? []).map((p) => ({ x: xs(p.day), y: ys(p.level) }))
  const bandTop: Pt[] = (kf?.path ?? []).map((p) => ({ x: xs(p.day), y: ys(p.level + Math.sqrt(p.levelVar)) }))
  const bandBot: Pt[] = (kf?.path ?? []).map((p) => ({ x: xs(p.day), y: ys(p.level - Math.sqrt(p.levelVar)) }))
  const bandPath =
    bandTop.length > 1 ? `${linePath(bandTop)} ${linePath([...bandBot].reverse()).replace('M', 'L')} Z` : ''

  const rate = kf?.rateLbPerWeek ?? 0
  const std = kf?.stdLbPerWeek ?? 0
  const scrubX = xs(revealedN - 1)

  const yTicks = makeTicks(yMin, yMax, 4)

  return (
    <section id="signal" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mb-8 text-center">
        <Pill tone="mint">📡 Signal through noise · the real Kalman filter</Pill>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-aurora-textPrimary md:text-4xl">
          One weigh-in lies. The trend doesn&apos;t.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-aurora-textSecondary">
          Daily weight swings ±2 lb on water and carbs — so the scale gaslights you. Scrub the days
          and watch the engine&apos;s local-linear-trend Kalman filter pull the{' '}
          <span className="text-aurora-mint">true line</span> out of the chaos and call your real
          rate of change.
        </p>
      </div>

      <GlassCard strong className="p-5 md:p-7">
        <div className="grid gap-7 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Noisy weigh-ins with Kalman trend">
              {/* gridlines */}
              {yTicks.map((t) => (
                <g key={t}>
                  <line x1={PX0} x2={PX1} y1={ys(t)} y2={ys(t)} stroke={Aurora.borderHair} strokeWidth={1} />
                  <text x={PX0 - 8} y={ys(t) + 4} textAnchor="end" fontSize="11" fill={Aurora.textTertiary}>
                    {Math.round(t)}
                  </text>
                </g>
              ))}
              <text x={PX0 - 8} y={PY0 - 10} textAnchor="end" fontSize="10" fill={Aurora.textTertiary}>
                lb
              </text>
              <text x={(PX0 + PX1) / 2} y={H - 2} textAnchor="middle" fontSize="10" fill={Aurora.textTertiary}>
                days
              </text>

              {/* confidence band */}
              {bandPath && <path d={bandPath} fill={Aurora.mint} opacity={0.12} />}

              {/* future (unrevealed) weigh-ins — dim */}
              {series.weighIns.slice(revealedN).map((w) => (
                <circle key={`f${w.day}`} cx={xs(w.day)} cy={ys(w.lb)} r={2.6} fill={Aurora.textTertiary} opacity={0.28} />
              ))}

              {/* scrub line */}
              <line x1={scrubX} x2={scrubX} y1={PY0} y2={PY1} stroke={Aurora.violetBright} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />

              {/* the true trend (engine) */}
              {trendPts.length > 1 && (
                <>
                  <path d={areaPath(trendPts, PY1)} fill="none" />
                  <path
                    d={smoothPath(trendPts)}
                    fill="none"
                    stroke={Aurora.mint}
                    strokeWidth={3}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${Aurora.mint}aa)` }}
                  />
                </>
              )}

              {/* revealed weigh-ins — the chaos */}
              {revealed.map((w) => (
                <circle key={w.day} cx={xs(w.day)} cy={ys(w.lb)} r={3} fill={Aurora.cyan} opacity={0.8} />
              ))}
            </svg>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Engine calls" value={`${rate >= 0 ? '+' : ''}${rate.toFixed(2)}`} sub="lb / week" accent={Aurora.mint} />
              <Stat label="Confidence ±1σ" value={`${std.toFixed(2)}`} sub="lb / week" accent={Aurora.amber} />
              <Stat label="Hidden truth" value={`${TRUE_RATE.toFixed(2)}`} sub="lb / week" accent={Aurora.cyan} />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <Slider
              label="Days logged"
              value={reveal}
              min={4}
              max={TOTAL_DAYS}
              step={1}
              unit="days"
              onChange={setReveal}
              accent={Aurora.violetBright}
            />
            <Slider
              label="Daily noise (water weight)"
              value={noise}
              min={0.4}
              max={3}
              step={0.1}
              unit="lb sd"
              onChange={setNoise}
              format={(v) => `±${v.toFixed(1)}`}
              accent={Aurora.cyan}
            />
            <div className="rounded-xl border border-aurora-borderHair bg-aurora-bg/40 p-4 text-sm leading-relaxed text-aurora-textSecondary">
              Notice how the called rate{' '}
              <span className="text-aurora-textPrimary">settles toward {TRUE_RATE.toFixed(2)} lb/wk</span> as
              you log more days, and the confidence band <span className="text-aurora-mint">narrows</span>.
              Crank the noise up and the band widens honestly — the engine never pretends to know more
              than the data supports.
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}

function makeTicks(min: number, max: number, count: number): number[] {
  const step = (max - min) / count
  return Array.from({ length: count + 1 }, (_, i) => min + step * i)
}
