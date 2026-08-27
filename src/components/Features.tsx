import { GlassCard } from './ui'
import { WaitlistForm } from './Waitlist'

const FEATURES = [
  {
    icon: '🔒',
    title: 'Local-first by design',
    body: 'Your weigh-ins, labs, and food log live on your device in plain SQLite. The engine runs offline. Nothing is sold, nothing is mined.',
    accent: '#46E5B5',
  },
  {
    icon: '🧬',
    title: 'Three engines, one spine',
    body: 'Systemic, Fueling, and Capacity track your body from different angles. The Coach is the bidirectional spine that ties them together.',
    accent: '#9A4DFF',
  },
  {
    icon: '📈',
    title: 'Adaptive, not generic',
    body: 'It re-anchors on your observed TDEE instead of a static calculator — the Mifflin seed is off by 250+ kcal for most people. LyfeX learns your real number.',
    accent: '#7DE3FF',
  },
  {
    icon: '🛡️',
    title: 'Protects your muscle',
    body: 'A hard safety cap — max 2 lb/wk or 1% bodyweight — keeps aggressive goals from costing you lean mass. Grounded in the sports-nutrition literature.',
    accent: '#F3C969',
  },
  {
    icon: '🩺',
    title: 'Labs that mean something',
    body: 'Biomarkers, body comp, and vitals get evidence-graded interpretation with real reference bands — not a wall of numbers you have to decode yourself.',
    accent: '#FF6E8E',
  },
  {
    icon: '🎙️',
    title: 'Log by talking',
    body: 'On-device speech-to-text turns "two eggs and a coffee" into a parsed entry. Fast capture, no typing, no round-trip to a server.',
    accent: '#FFA94D',
  },
]

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-aurora-textPrimary md:text-4xl">
          Built like an instrument, not an app.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-aurora-textSecondary">
          Every surface is the same philosophy: honest math, your data, on your device.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <GlassCard key={f.title} className="group p-6 transition hover:-translate-y-1">
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{ background: `${f.accent}22`, border: `1px solid ${f.accent}55` }}
            >
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-aurora-textPrimary">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-aurora-textSecondary">{f.body}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard strong className="mt-12 flex flex-col items-center gap-5 p-10 text-center">
        <h3 className="max-w-2xl text-2xl font-extrabold tracking-tight text-aurora-textPrimary md:text-3xl">
          The forecast you just played with? That&apos;s the real engine.
        </h3>
        <p className="max-w-xl text-aurora-textSecondary">
          Same formulas, same safety logic, ported straight from the app. LyfeX is in pre-launch — be
          first to know when it opens.
        </p>
        <WaitlistForm />
        <p className="text-xs text-aurora-textTertiary">One email when LyfeX opens. Nothing else.</p>
      </GlassCard>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-aurora-borderHair">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-10 text-sm text-aurora-textTertiary md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-base font-extrabold tracking-tight text-aurora-textPrimary">
            Lyfe<span className="iris-text">X</span>
          </span>
          {/* the app's splash tagline, same treatment: caps, wide tracking, tertiary */}
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Know your body
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="https://westinreast.github.io/lyfexprivacy/" className="transition hover:text-aurora-textPrimary">
            Privacy
          </a>
          <a href="https://westinreast.github.io/lyfexprivacy/terms.html" className="transition hover:text-aurora-textPrimary">
            Terms
          </a>
          <a href="mailto:westinreast@lyfex.ai" className="transition hover:text-aurora-textPrimary">
            Contact
          </a>
        </nav>
        <span>© 2026 Vitalshield Solutions LLC</span>
      </div>
      <p className="mx-auto max-w-2xl px-5 pb-8 text-center text-xs leading-relaxed text-aurora-textTertiary/80">
        LyfeX is a fitness and wellness tool, not a medical device or a substitute for professional
        medical advice. Always consult a qualified provider before starting any exercise or
        nutrition program.
      </p>
    </footer>
  )
}
