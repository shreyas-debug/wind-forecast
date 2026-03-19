# Wind Forecast Challenge

This repository contains the solution for the full-stack Software Engineering challenge: a forecast monitoring application and the accompanying historical analysis.

## Repository Structure

1. **`wind-forecast-app/`** 
   - A Vite + React web application built without any heavy UI frameworks, adhering to modern UI standards with vanilla CSS.
   - Fetches generation outturns and forecasts dynamically from the **Elexon BMRS API**.
2. **`wind-forecast-analysis/`**
   - Python environment and Jupyter Notebooks explicitly analyzing the forecast's fundamental characteristics based on First Principles reasoning.

## How to Start the Web Application

1. Navigate to the app directory:
   ```bash
   cd wind-forecast-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the app on your browser (usually `http://localhost:5173/`). Ensure you select dates from Jan 2025 onwards, as per the rules.

## AI Declaration

**AI Tools Usage:**
- **Web Application:** AI tools were used to scaffold the React components context logic, styling CSS tokens, and initial API fetching mappings (Recharts boilerplate).
- **Data Analysis (`01_forecast_error_analysis.ipynb` & `02_historical_wind_reliability.ipynb`):** No AI tools were used end-to-end to synthesize the conclusions. The first-principles mathematical and physical reasoning regarding grid stability, error bounds, and statistical analysis properties are manually authored and fundamentally guided natively, utilizing AI purely for low-level Pandas syntax checking as permitted.

## Deployment Link
- **Vercel Link:** [Link to Vercel/Heroku if you deploy directly will go here] 

_**Note on Elexon API Restrictions:** Due to recent API limits and standard parameters on BMRS datasets without a scripting token, the React app dynamically correlates target bounds. Best viewed utilizing standard current ranges._
