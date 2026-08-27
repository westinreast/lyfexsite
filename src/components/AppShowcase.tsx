import { GlassCard, Pill } from './ui'

// The app's deepest capabilities — the site demos are a sliver of the engine.
// Claims here are deliberately conservative: "glucose-aware" not "Dexcom
// integration", a curated 22-variant DNA panel not "reads your genome", and
// nothing from research-gated surfaces (disease naming, supplement stacks).
const CAPABILITIES = [
  {
    icon: '🌌',
    title: 'A map of what actually moves you',
    body: 'The Discovery Atlas runs true causal discovery (PCMCI — the same class of algorithm climate scientists use) across 43 daily channels of your life, then condenses it to the handful of drivers that run your physiology. Time-lagged, confound-conditioned, and re-checked weekly for stability.',
    accent: '#9A4DFF',
  },
  {
    icon: '🎲',
    title: 'Run real experiments on yourself',
    body: 'Does magnesium actually help your sleep? LyfeX schedules randomized ON/OFF blocks you can’t predict — the same allocation concealment real clinical trials use — then analyzes the outcome with Bayesian time-series statistics. Not a correlation. Your answer.',
    accent: '#46E5B5',
  },
  {
    icon: '🪜',
    title: 'An evidence ladder, not vibes',
    body: 'Every finding is graded: Linked → Direct link → Tested-on-you. And when two habits are too tangled to separate, the app literally says "can’t tell apart" — then offers to run the experiment that untangles them. It never borrows certainty it doesn’t have.',
    accent: '#7DE3FF',
  },
  {
    icon: '📅',
    title: 'Forecasts that grade themselves',
    body: 'The engine predicts tomorrow’s resting heart rate, readiness, and sleep with 80% confidence bands — then scores its own accuracy and shows you the report card: hit rate, bias, coverage. When it drifts, it recalibrates itself.',
    accent: '#F3C969',
  },
  {
    icon: '🧬',
    title: 'Labs, DNA, and biological age',
    body: 'Upload a lab PDF and it parses 43 biomarkers with clinical scores — ASCVD, HOMA-IR, and PhenoAge biological age fitted on NHANES data. Import your 23andMe or Ancestry raw file for a curated 22-variant panel, where a real blood measurement always overrides a gene.',
    accent: '#FF6E8E',
  },
  {
    icon: '🏋️',
    title: 'Training science, fit to you',
    body: 'Find your personal weekly-volume ceiling with a monitored titration protocol. Learn whether your bench is chest-limited or tricep-limited from your own accessory data. Priors come from the sports-science literature; the numbers become yours as you train.',
    accent: '#FFA94D',
  },
]

const ALSO = [
  'Oura',
  'WHOOP',
  'Withings',
  'Health Connect',
  'Glucose-aware',
  'Cycle-aware',
  'Medication-aware',
  'One ask a day, never spam',
  '7-day meal planner',
  'On-device · local-first',
]

export function AppShowcase() {
  return (
    <section id="app" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mb-12 text-center">
        <Pill tone="rose">🔬 Inside the app · beyond the demos</Pill>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-aurora-textPrimary md:text-4xl">
          The demos above are a sliver of the engine.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-aurora-textSecondary">
          Every other app tells you what to do. LyfeX tells you what it actually knows, what it
          can&apos;t tell apart — and then runs the experiment to find out.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <GlassCard key={c.title} className="group p-6 transition hover:-translate-y-1">
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{ background: `${c.accent}22`, border: `1px solid ${c.accent}55` }}
            >
              {c.icon}
            </div>
            <h3 className="text-lg font-bold text-aurora-textPrimary">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-aurora-textSecondary">{c.body}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {ALSO.map((label) => (
          <span
            key={label}
            className="rounded-full border border-aurora-borderHair bg-aurora-bg/40 px-3.5 py-1.5 text-xs font-medium text-aurora-textSecondary"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
