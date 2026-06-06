import { motion } from 'framer-motion'
import { Pill } from './ui'

export function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-5 pb-4 pt-32 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Pill tone="violet">Local-first health · pre-launch</Pill>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-aurora-textPrimary md:text-7xl"
        >
          Your body has an
          <br />
          <span className="iris-text">engine.</span> Now you can{' '}
          <span className="relative whitespace-nowrap">
            see it.
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-iris opacity-70" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-aurora-textSecondary md:text-xl"
        >
          LyfeX models your real metabolism — TDEE that adapts, a safety cap that protects your
          muscle, a filter that sees through the daily scale chaos. No generic calculators. No cloud
          guesswork. Below, the actual engine runs in your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#engine"
            className="rounded-full bg-aurora-violet px-7 py-3.5 text-base font-bold text-white shadow-glow transition hover:scale-[1.03] hover:bg-aurora-violetBright"
          >
            Play with the engine ↓
          </a>
          <a
            href="#features"
            className="rounded-full border border-aurora-borderSubtle px-7 py-3.5 text-base font-semibold text-aurora-textPrimary transition hover:border-aurora-violet/60"
          >
            How it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-aurora-textTertiary"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora-mint" />
          100% client-side math · no LLM, no API calls, your numbers never leave the page
        </motion.div>
      </div>
    </section>
  )
}
