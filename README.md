# Wind Forecast Challenge

Full-stack submission: a **forecast monitoring web app** (Elexon BMRS) and **Jupyter analysis** of forecast error and historical wind reliability.

## Repository layout

| Path | Purpose |
|------|---------|
| **`wind-forecast-app/`** | Vite + React app: date range, 0–48h horizon slider, actual (blue) vs forecast (green) chart; dataset + application + analysis links. |
| **`wind-forecast-analysis/`** | `01_forecast_error_analysis.ipynb` — error stats vs horizon / time of day. `02_historical_wind_reliability.ipynb` — historical actuals and MW recommendation. |

## How to run the application

```bash
cd wind-forecast-app
npm install
npm run dev
```

Open the URL shown (typically `http://localhost:5173/`). For production:

```bash
npm run build
npm run preview
```

**Data rules (implemented in app):** actuals from **FUELHH** (`fuelType` WIND), **Jan 2025+**; forecasts from **WINDFOR** with lead time **0–48h**; for each target half-hour, the **latest** forecast with `publishTime` at least **horizon** hours before the target; missing forecasts are not plotted.

## Deployment

Add your hosted URL after deploying (e.g. Vercel, Netlify, Cloudflare Pages):

- **Deployed app:** *[replace with your URL]*

Build output is `wind-forecast-app/dist/` — configure the platform to run `npm run build` with publish directory `dist`.

## AI usage

| Area | What was used for | What wasn’t |
|------|-------------------|---------------|
| **Web app** | Boilerplate, layout/CSS, Recharts setup, BMRS fetch/filter glue | — |
| **Notebooks** | Optional syntax/debug help only | End-to-end analysis, conclusions, or narrative (per challenge: your reasoning) |

Treat the live API as the source of truth for app behaviour; notebook claims should match what you ran and wrote up yourself.

---

*Elexon public stream endpoints may only return recent forecast batches without a scripting token; the UI works best when the selected range overlaps recent days.*
