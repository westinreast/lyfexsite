// The LyfeX brand mark — the app's serif "X" with the EKG trace through its
// vertical center, ported to inline SVG from the app's canonical components:
//   lib/components/brand/ekg_painter.dart    (polyline geometry, glow + gradient)
//   lib/components/brand/lyfex_wordmark.dart (lockup: EKG centerline through X center)
// Polyline points are the Dart constants on a 300×120 canvas, shifted down 6.5
// (the wordmark's _ekgTop) onto the 300×156 lockup canvas. Gradient stops are the
// brand's iris trio at 0 / 46% / 100%.
const EKG = '0,66.5 88,66.5 106,33.5 125,103.5 138,46.5 157,66.5 300,66.5'

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 156" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="iris-ekg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF2EA0" />
          <stop offset="0.46" stopColor="#9A4DFF" />
          <stop offset="1" stopColor="#4DC3FF" />
        </linearGradient>
      </defs>
      {/* Gelasio is the app's bundled "LyfeX Serif" (SIL OFL Georgia clone) */}
      <text
        x="150"
        y="118"
        textAnchor="middle"
        fontFamily="Gelasio, Georgia, serif"
        fontWeight="700"
        fontSize="150"
        fill="#F2EAFA"
      >
        X
      </text>
      <polyline
        points={EKG}
        fill="none"
        stroke="#9A4DFF"
        strokeWidth="16"
        strokeOpacity="0.18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={EKG}
        fill="none"
        stroke="url(#iris-ekg)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
