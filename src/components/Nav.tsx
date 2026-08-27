import { BrandMark } from './BrandMark'

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-aurora-textPrimary">
            Lyfe<span className="iris-text">X</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-aurora-textSecondary md:flex">
          <a href="#engine" className="transition hover:text-aurora-textPrimary">
            Playable Engine
          </a>
          <a href="#signal" className="transition hover:text-aurora-textPrimary">
            Signal &amp; Noise
          </a>
          <a href="#app" className="transition hover:text-aurora-textPrimary">
            Inside the app
          </a>
          <a href="#features" className="transition hover:text-aurora-textPrimary">
            How it works
          </a>
        </nav>
        <a
          href="#engine"
          className="rounded-full bg-aurora-violet px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-aurora-violetBright"
        >
          Try the engine
        </a>
      </div>
    </header>
  )
}
