// Tiny SVG chart helpers — linear scales + smooth path builder. Kept dependency
// free so the charts are pure inline SVG (fast, crisp, no canvas).

export interface Scale {
  (v: number): number
}

export function linScale(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0 || 1
  return (v: number) => r0 + ((v - d0) / span) * (r1 - r0)
}

export interface Pt {
  x: number
  y: number
}

/** Catmull-Rom → cubic-bezier smoothing for a pleasant, honest curve. */
export function smoothPath(points: Pt[], tension = 0.5): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function linePath(points: Pt[]): string {
  if (!points.length) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

/** Build a closed area path under a line down to a baseline y. */
export function areaPath(points: Pt[], baselineY: number, smooth = true): string {
  if (points.length < 2) return ''
  const top = smooth ? smoothPath(points) : linePath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${top} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`
}

export function niceBounds(min: number, max: number, pad = 0.08): [number, number] {
  if (min === max) return [min - 1, max + 1]
  const span = max - min
  return [min - span * pad, max + span * pad]
}
