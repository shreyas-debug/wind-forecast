import React from 'react';

export default function Controls({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  horizon,
  setHorizon
}) {
  return (
    <div className="controls-card">
      <div className="controls-row">
        <div className="control-group">
          <label htmlFor="start-time">Start time</label>
          <input
            id="start-time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="end-time">End time</label>
          <input
            id="end-time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="control-group horizon-group">
          <label htmlFor="horizon-slider">
            Forecast horizon (minimum lead): <span className="horizon-value">{horizon}h</span>
          </label>
          <input
            id="horizon-slider"
            type="range"
            min="0"
            max="48"
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="slider"
            aria-valuemin={0}
            aria-valuemax={48}
            aria-valuenow={horizon}
          />
          <div className="slider-labels">
            <span>0h</span>
            <span>48h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
