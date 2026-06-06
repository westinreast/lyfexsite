import type { ReactNode } from 'react'

export function GlassCard({
  children,
  className = '',
  strong = false,
}: {
  children: ReactNode
  className?: string
  strong?: boolean
}) {
  return (
    <div className={`${strong ? 'glass-strong' : 'glass'} rounded-2xl ${className}`}>{children}</div>
  )
}

export function Pill({ children, tone = 'violet' }: { children: ReactNode; tone?: 'violet' | 'mint' | 'amber' | 'rose' }) {
  const tones: Record<string, string> = {
    violet: 'text-aurora-violetBright border-aurora-violet/40 bg-aurora-violet/10',
    mint: 'text-aurora-mint border-aurora-mint/40 bg-aurora-mint/10',
    amber: 'text-aurora-amber border-aurora-amber/40 bg-aurora-amber/10',
    rose: 'text-aurora-rose border-aurora-rose/40 bg-aurora-rose/10',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  format,
  accent = '#9A4DFF',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
  format?: (v: number) => string
  accent?: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-aurora-textSecondary">{label}</label>
        <span className="font-mono text-base font-semibold tabular-nums" style={{ color: accent }}>
          {format ? format(value) : value}
          {unit ? <span className="ml-0.5 text-xs text-aurora-textSecondary">{unit}</span> : null}
        </span>
      </div>
      <input
        type="range"
        className="aurora-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

export function Stat({
  label,
  value,
  sub,
  accent = '#F2EAFA',
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-aurora-borderHair bg-aurora-bg/40 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-aurora-textTertiary">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-bold tabular-nums" style={{ color: accent }}>
        {value}
      </div>
      {sub ? <div className="mt-0.5 text-xs text-aurora-textSecondary">{sub}</div> : null}
    </div>
  )
}

export function SegToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-aurora-borderHair bg-aurora-bg/40 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            value === o.value
              ? 'bg-aurora-violet/25 text-aurora-violetBright shadow-glow'
              : 'text-aurora-textSecondary hover:text-aurora-textPrimary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
