# LyfeX marketing site

A self-contained **Vite + React + TS + Tailwind** marketing site, styled in the LyfeX
**Aurora** language. Fully isolated from the Flutter/Python app — it lives entirely under
`web/`, has its own `package.json` + `node_modules`, and touches no app code.

## The gimmick (no LLM, pure client-side math)

The site ports the **real** LyfeX engine formulas to TypeScript (`src/engine/`):

| Web module | Ported from |
| --- | --- |
| `engine/mifflin.ts` | `onboarding_nutrition.py` — Mifflin-St Jeor BMR + activity multipliers |
| `engine/safety.ts` | `fueling/axes/acute.py` — `safety_max_pace` / `clamp_pace_to_safety` |
| `engine/kalman.ts` | `fueling/axes/trend_filters.py` — `compute_rate_kalman` (2-state local-linear-trend) |
| `engine/forecast.ts` | weekly closed-loop using the above (adapting TDEE + biting safety cap) |
| `engine/noise.ts` | deterministic noisy weigh-in generator for the Kalman demo |

Two interactive surfaces:

1. **Playable Engine** — drag current weight / goal / pace and the Aurora chart forecasts your
   real trajectory live: the cap `max(2 lb/wk, 1% BW)` visibly engaging, TDEE adapting as weight
   falls, the curve converging to your pace.
2. **Signal through noise** — scrub noisy daily weigh-ins and watch the actual Kalman filter draw
   the true trend and call the real rate of change with honest confidence.

No network calls. No LLM. Your numbers never leave the page.

## Local development

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # → web/dist (static, Cloudflare Pages target)
npm run preview  # serve the production build locally
```

## Cloudflare Pages settings

- **Production branch:** `marketing-site`
- **Root directory:** `web`
- **Build command:** `npm run build`
- **Build output directory:** `dist` (resolves to `web/dist`)
- **Framework preset:** Vite (or "None" — the build command above is all that's needed)
- Node version: 18+ (24 used in dev). Set `NODE_VERSION=20` in Pages env vars if needed.
