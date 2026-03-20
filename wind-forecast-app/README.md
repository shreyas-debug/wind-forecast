# UK wind forecast monitor

React + Vite + Recharts. Fetches **FUELHH** (WIND actuals) and **WINDFOR** (forecasts) from `data.elexon.co.uk`, merges by target time with the horizon rule from the challenge brief.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint |

## Environment

No API keys required for the public BMRS stream endpoints used here.

See the **repository root `README.md`** for challenge context, deployment, and analysis notebooks.
