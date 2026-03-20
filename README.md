# Wind Forecast Challenge

Full-stack submission: a **forecast monitoring web app** (Elexon BMRS) and **Jupyter analysis** of forecast error and historical wind reliability.

## Repository layout

| Path | Purpose |
|------|---------|
| **`wind-forecast-app/`** | Vite + React app: date range, 0–48h horizon slider, actual (blue) vs forecast (green) chart. UI: **(1)** Dataset + Application, **(2)** Analysis. Submission steps stay in this README only. |
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

## AI tools (declaration)

- **Web app:** AI assistance was used for scaffolding, styling, Recharts wiring, and BMRS fetch/filter logic; you are expected to review behaviour against the live API.
- **Notebooks:** Per challenge rules, analysis reasoning should be your own. AI may be used only for low-level help (e.g. pandas syntax). State your practice in the notebooks / interview if asked.

## Submission checklist (challenge)

- [ ] Git repository with meaningful commits  
- [ ] This `README` (structure, run instructions, **deployment link**)  
- [ ] Zip including **`.git`**, uploaded (e.g. Google Drive) with link accessible to reviewers  
- [ ] Unlisted demo video (≤5 min): app + analysis summary  
- [ ] Submit via the employer’s form  

---

*Elexon public stream endpoints may only return recent forecast batches without a scripting token; the UI notes this and works best when the selected range overlaps recent days.*
