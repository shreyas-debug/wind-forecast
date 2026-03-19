import React, { useState, useEffect } from 'react';
import { format, subHours } from 'date-fns';
import { fetchActualWindGeneration, fetchForecastWindGeneration } from '../api/elexon';
import ChartWidget from './ChartWidget';
import Controls from './Controls';

// Example Default Dates: 
// The UK time might be UTC or Europe/London, so keeping it generic:
const DEFAULT_START = "2025-01-01T00:00";
const DEFAULT_END = "2025-01-02T00:00";

export default function Dashboard() {
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [endTime, setEndTime] = useState(DEFAULT_END);
  const [horizon, setHorizon] = useState(4); // 4 hours
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

        // Ensure we load forecasts for the same timespan that targets the specific horizon
        const [actuals, forecasts] = await Promise.all([
          fetchActualWindGeneration(isoStart, isoEnd),
          fetchForecastWindGeneration(isoStart, isoEnd)
        ]);

        // Map data linearly by half-hour boundaries
        const rawMap = new Map();
        
        actuals.forEach(act => {
          rawMap.set(act.targetTime, { actual: act.actualGeneration, timeStr: format(new Date(act.targetTime), 'HH:mm dd/MM/yy') });
        });

        forecasts.forEach(fc => {
          const tTime = new Date(fc.targetTime);
          const pTime = new Date(fc.publishTime);
          
          // Horizon in hours: target - horizon.
          // latest forecast that was created AT LEAST `horizon` hours before target.
          const maxPublishTime = subHours(tTime, horizon);

          // Only consider the forecast if it was published strictly on or before the horizon cutoff limit.
          if (pTime <= maxPublishTime) {
            const entry = rawMap.get(fc.targetTime) || { actual: null, timeStr: format(tTime, 'HH:mm dd/MM/yy') };
            // Update to keep only the newest forecast that satisfies the condition
            if (!entry.chosenFc || pTime > entry.chosenFc.pTime) {
              entry.chosenFc = { pTime, val: fc.forecastedGeneration };
            }
            rawMap.set(fc.targetTime, entry);
          }
        });

        // Convert Map to sorted array
        const sortedKeys = Array.from(rawMap.keys()).sort();
        const finalData = sortedKeys.map(key => {
          const item = rawMap.get(key);
          // If no forecast meets the criteria, it will be undefined (dropped by connectNulls=false)
          return {
            timeStr: item.timeStr,
            actual: item.actual !== null ? item.actual : undefined,
            forecasted: item.chosenFc ? item.chosenFc.val : undefined,
          };
        });

        setData(finalData);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Note: The ELEXON API might not have Jan 2025+ data if queried entirely historically without keys, or limit sets.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [startTime, endTime, horizon]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Wind Forecast Monitoring</h1>
        <p>Monitor actual vs forecasted wind generation with configurable horizons.</p>
      </header>

      <Controls 
        startTime={startTime} 
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        horizon={horizon}
        setHorizon={setHorizon}
      />

      <div className="chart-section">
        {loading && <div className="loading-state">Fetching ELEXON Data...</div>}
        {error && <div className="error-state">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <div className="empty-state">No data available for this range. Try adjusting dates to Jan 2025 onwards.</div>
        )}
        {!loading && !error && data.length > 0 && (
          <ChartWidget data={data} />
        )}
      </div>
    </div>
  );
}
