import { useState, type FormEvent } from 'react'

// Real launch waitlist — writes to the LyfeX Supabase project.
// The publishable key is safe to ship: waitlist_signups is RLS anon-INSERT-only
// (no select/update/delete policies), so the browser can add an email but can
// never read the list back.
const SUPABASE_URL = 'https://xllngtlxdyzkobowvmjr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_vPLJVcC2GqGZnlOrGCZa_g_uxy2A84c'

type State = 'idle' | 'busy' | 'done' | 'error'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (state === 'busy') return
    setState('busy')
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email: email.trim(), source: 'marketing_site' }),
      })
      // 201 = added; 409 = duplicate email, which is success from the visitor's
      // point of view ("you're on the list") and leaks nothing.
      setState(res.status === 201 || res.status === 409 ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="rounded-full border border-aurora-mint/40 bg-aurora-mint/10 px-6 py-3 font-semibold text-aurora-mint">
        You&apos;re on the list — see you at launch. ✓
      </p>
    )
  }

  return (
    <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="flex-1 rounded-full border border-aurora-borderSubtle bg-aurora-bg/60 px-5 py-3 text-aurora-textPrimary placeholder:text-aurora-textTertiary focus:border-aurora-violet focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'busy'}
        className="rounded-full bg-aurora-violet px-6 py-3 font-bold text-white shadow-glow transition hover:bg-aurora-violetBright disabled:opacity-60"
      >
        {state === 'busy' ? 'Adding…' : 'Notify me'}
      </button>
      {state === 'error' && (
        <p className="w-full text-center text-xs text-aurora-rose sm:text-left">
          Something went wrong — try again, or email{' '}
          <a className="underline" href="mailto:westinreast@lyfex.ai">
            westinreast@lyfex.ai
          </a>
        </p>
      )}
    </form>
  )
}
