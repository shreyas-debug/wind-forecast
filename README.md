# UK wind forecast monitor

Web app for the challenge: compare **national UK wind generation** (actual outturns) to **forecasts** from Elexon BMRS for the same half-hourly periods. Pick a start/end time and a **forecast horizon** (0–48h): for each target time, the chart uses the latest forecast issued at least that many hours before the target. Actuals (blue) and forecasts (green); missing forecast points are not plotted.

## Files and directories

| Path | Description |
|------|-------------|
| **`wind-forecast-app/`** | React (Vite) frontend: dashboard, chart (Recharts), BMRS API client (`FUELHH` actuals, `WINDFOR` forecasts). |
| **`wind-forecast-app/src/api/elexon.js`** | Fetches and filters Elexon data (Jan 2025+ actuals; forecasts with 0–48h lead time). |
| **`wind-forecast-app/src/components/`** | UI: `Dashboard`, `ChartWidget`, `Controls`, `DatasetPanel`. |
| **`wind-forecast-app/src/constants/`** | Shared URLs (BMRS docs, GitHub notebook links). |
| **`wind-forecast-analysis/`** | Jupyter notebooks: forecast error analysis and historical wind / MW reliability. |
| **`package.json`** (repo root) | `npm run build` — builds the Vite app under `wind-forecast-app/`. |
| **`vercel.json`** (repo root) | Vercel build output path and SPA rewrites. |

## How to start the application

```bash
cd wind-forecast-app
npm install
npm run dev
```

Then open the local URL (e.g. `http://localhost:5173/`).

Production build:

```bash
cd wind-forecast-app
npm run build
npm run preview
```

## Live app

**https://wind-forecast-kappa.vercel.app/**
