import React, { useState, useEffect } from 'react';
import { format, subHours } from 'date-fns';
import { fetchActualWindGeneration, fetchForecastWindGeneration } from '../api/elexon';
import ChartWidget from './ChartWidget';
import Controls from './Controls';
import DatasetPanel from './DatasetPanel';
import { NOTEBOOK_FORECAST_ERROR, NOTEBOOK_RELIABILITY } from '../constants/repo';

function getDefaultDates() {
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 16);
  return { start: fmt(start), end: fmt(end) };
}

const defaults = getDefaultDates();

function SectionHeading({ title, description }) {
  return (
    <div className="section-heading">
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-desc">{description}</p> : null}
    </div>
  );
}

export default function Dashboard() {
  const [startTime, setStartTime] = useState(defaults.start);
  const [endTime, setEndTime] = useState(defaults.end);
  const [horizon, setHorizon] = useState(4);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!startTime || !endTime) return;

      setLoading(true);
      setError(null);
      try {
        const isoStart = new Date(startTime).toISOString();
        const isoEnd = new Date(endTime).toISOString();

        const [actuals, forecasts] = await Promise.all([
          fetchActualWindGeneration(isoStart, isoEnd),
          fetchForecastWindGeneration(isoStart, isoEnd)
        ]);

        const rawMap = new Map();

        actuals.forEach((act) => {
          rawMap.set(act.targetTime, {
            actual: act.actualGeneration,
            timeStr: format(new Date(act.targetTime), 'HH:mm dd/MM/yy')
          });
        });

        forecasts.forEach((fc) => {
          const tTime = new Date(fc.targetTime);
          const pTime = new Date(fc.publishTime);
          const maxPublishTime = subHours(tTime, horizon);

          if (pTime <= maxPublishTime) {
            const entry = rawMap.get(fc.targetTime) || {
              actual: null,
              timeStr: format(tTime, 'HH:mm dd/MM/yy')
            };
            if (!entry.chosenFc || pTime > entry.chosenFc.pTime) {
              entry.chosenFc = { pTime, val: fc.forecastedGeneration };
            }
            rawMap.set(fc.targetTime, entry);
          }
        });

        const sortedKeys = Array.from(rawMap.keys()).sort();
        const finalData = sortedKeys.map((key) => {
          const item = rawMap.get(key);
          return {
            timeStr: item.timeStr,
            actual: item.actual !== null ? item.actual : undefined,
            forecasted: item.chosenFc ? item.chosenFc.val : undefined
          };
        });

        setData(finalData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data from Elexon BMRS API. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [startTime, endTime, horizon]);

  return (
    <div className="dashboard-container">
      <header className="app-header animate-fade-in">
        <div className="app-header-title-group">
          <h1 className="app-title">UK wind forecast monitor</h1>
          <p className="app-subtitle">UK national wind power · Elexon BMRS</p>
        </div>
        <p className="app-tagline">
          Compare <span className="hero-accent hero-accent--actual">actual</span> generation (blue) to the
          latest eligible <span className="hero-accent hero-accent--forecast">forecast</span> (green) for each
          half-hour to see accuracy at a glance.
        </p>
      </header>

      <section id="part-monitor" className="content-section challenge-block animate-fade-in delay-100">
        <SectionHeading
          title="Forecast monitoring app"
          description="Pick a time range and horizon. The chart follows the challenge rule: for each target time, use the newest forecast issued at least horizon hours before that target (default 4h)."
        />
        <Controls
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          horizon={horizon}
          setHorizon={setHorizon}
        />
        <div className="chart-section" style={{ marginTop: '0.5rem' }}>
          {loading && <div className="loading-state">Loading Elexon data…</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && data.length === 0 && (
            <div className="empty-state">
              No points in this range. Try recent dates so forecasts overlap your window; actuals require Jan
              2025+.
            </div>
          )}
          {!loading && !error && data.length > 0 && <ChartWidget data={data} />}
        </div>

        <div className="challenge-subsection challenge-subsection--divider">
          <SectionHeading
            title="Dataset & Challenge Details"
            description="The stream API rules and dataset specs governing this application."
          />
          <DatasetPanel />
        </div>
      </section>

      <section id="part-analysis" className="content-section challenge-block challenge-block--muted animate-fade-in delay-200">
        <SectionHeading
          title="Analysis"
          description="Offline notebooks in the repo study forecast error (distribution, horizon, time-of-day) and historical wind reliability with an MW planning recommendation."
        />
        <ul className="analysis-list">
          <li>
            <a
              className="analysis-notebook-link"
              href={NOTEBOOK_FORECAST_ERROR}
              target="_blank"
              rel="noopener noreferrer"
            >
              01_forecast_error_analysis.ipynb
            </a>{' '}
            — error characteristics of the forecast dataset.
          </li>
          <li>
            <a
              className="analysis-notebook-link"
              href={NOTEBOOK_RELIABILITY}
              target="_blank"
              rel="noopener noreferrer"
            >
              02_historical_wind_reliability.ipynb
            </a>{' '}
            — actual generation history and dependable MW expectation.
          </li>
        </ul>
        <p className="analysis-run">
          Run locally: <code>cd wind-forecast-analysis</code> then open the notebooks in Jupyter or VS Code (see
          that folder for environment notes).
        </p>
      </section>
    </div>
  );
}
