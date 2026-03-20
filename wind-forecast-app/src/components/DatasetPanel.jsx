import React from 'react';
import { FUELHH_STREAM_DOC, WINDFOR_STREAM_DOC } from '../constants/bmrs';

export default function DatasetPanel() {
  return (
    <div className="challenge-subsection">
      <h3 className="challenge-h3">Dataset</h3>
      <p className="challenge-intro">
        Data from <strong>January 2025</strong> onward. Forecast rows must have lead time (target − publish) in{' '}
        <strong>0–48 hours</strong>. Missing forecast points are omitted—nothing is interpolated.
      </p>
      <div className="dataset-grid">
        <article className="dataset-card dataset-card--actual">
          <div className="dataset-card-head">
            <span className="dataset-badge">Actual generation</span>
            <span className="dataset-meta">FUELHH · WIND</span>
          </div>
          <ul className="dataset-fields">
            <li>
              <code>startTime</code> — target half-hour
            </li>
            <li>
              <code>generation</code> — MW
            </li>
          </ul>
          <a className="dataset-link" href={FUELHH_STREAM_DOC} target="_blank" rel="noopener noreferrer">
            FUELHH stream →
          </a>
        </article>
        <article className="dataset-card dataset-card--forecast">
          <div className="dataset-card-head">
            <span className="dataset-badge">Forecasted generation</span>
            <span className="dataset-meta">WINDFOR</span>
          </div>
          <ul className="dataset-fields">
            <li>
              <code>startTime</code> — target (same resolution)
            </li>
            <li>
              <code>publishTime</code> — issue time
            </li>
            <li>
              <code>generation</code> — MW
            </li>
          </ul>
          <a className="dataset-link" href={WINDFOR_STREAM_DOC} target="_blank" rel="noopener noreferrer">
            WINDFOR stream →
          </a>
        </article>
      </div>
      <p className="dataset-footnote">
        Illustrative charts may differ from live API values. The public stream often returns recent batches—overlap
        your range with the last few days to see both lines.
      </p>
    </div>
  );
}
