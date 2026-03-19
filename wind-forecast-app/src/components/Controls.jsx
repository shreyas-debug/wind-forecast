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
      <div className="control-group">
        <label>Start Time:</label>
        <input 
          type="datetime-local" 
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)} 
          className="date-input"
        />
      </div>

      <div className="control-group">
        <label>End Time:</label>
        <input 
          type="datetime-local" 
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)} 
          className="date-input"
        />
      </div>

      <div className="control-group horizon-group">
        <label>Forecast Horizon: {horizon}h</label>
        <input 
          type="range" 
          min="0" 
          max="48" 
          value={horizon}
          onChange={(e) => setHorizon(Number(e.target.value))} 
          className="slider"
        />
        <div className="slider-labels">
          <span>0h</span>
          <span>48h</span>
        </div>
      </div>
    </div>
  );
}
