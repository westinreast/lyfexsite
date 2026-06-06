// Ambient Aurora backdrop: drifting violet/coach/cyan glows + a faded grid.
// Mirrors the app's AuroraBackdrop mood (deep #0A0314 with iris glows).
export function AuroraBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-aurora-bg">
      <div className="absolute inset-0 grid-fade" />
      <div
        className="absolute -left-[10%] -top-[15%] h-[55vh] w-[55vh] rounded-full opacity-50 blur-[120px] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, #9A4DFF 0%, transparent 70%)' }}
      />
      <div
        className="absolute right-[-12%] top-[8%] h-[48vh] w-[48vh] rounded-full opacity-40 blur-[120px] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, #FF2EA0 0%, transparent 70%)', animationDelay: '-8s' }}
      />
      <div
        className="absolute bottom-[-18%] left-[30%] h-[50vh] w-[50vh] rounded-full opacity-30 blur-[130px] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, #4DC3FF 0%, transparent 70%)', animationDelay: '-15s' }}
      />
    </div>
  )
}
