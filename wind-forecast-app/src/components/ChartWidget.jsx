import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * ChartWidget receives data formatted as:
 * { timeStr: string, actual: number, forecasted: number | null }
 */
export default function ChartWidget({ data }) {
  const narrow = useMediaQuery('(max-width: 639px)');
  const compact = useMediaQuery('(max-width: 479px)');

  const chartHeight = compact ? 300 : narrow ? 340 : 420;
  const minTickGap = compact ? 56 : narrow ? 40 : 28;

  const margins = narrow
    ? { top: compact ? 36 : 38, right: 4, left: 0, bottom: compact ? 32 : 28 }
    : { top: 16, right: 12, left: 8, bottom: 64 };

  const formatTick = (value) => {
    if (typeof value !== 'string') return value;
    if (compact) {
      const parts = value.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[1]} ${parts[0]}`;
    }
    return value;
  };

  const tooltipStyle = {
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)',
    fontSize: narrow ? 12 : 13
  };

  return (
    <div className={`chart-wrapper${narrow ? ' chart-wrapper--narrow' : ''}`}>
      {narrow && (
        <p className="chart-axis-caption" aria-hidden="true">
          Power (MW)
        </p>
      )}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data} margin={margins}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebedf0" />
          <XAxis
            dataKey="timeStr"
            tick={{
              fill: '#64748b',
              fontSize: compact ? 9 : narrow ? 10 : 11
            }}
            tickMargin={narrow ? 6 : 8}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#e2e8f0' }}
            minTickGap={minTickGap}
            interval="preserveStartEnd"
            angle={narrow ? 0 : -35}
            textAnchor={narrow ? 'middle' : 'end'}
            height={narrow ? (compact ? 52 : 46) : 72}
            tickFormatter={formatTick}
          />
          <YAxis
            label={
              narrow
                ? undefined
                : {
                    value: 'Power (MW)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#64748b',
                    fontSize: 12
                  }
            }
            tick={{ fill: '#64748b', fontSize: narrow ? 9 : 11 }}
            tickLine={false}
            axisLine={false}
            width={narrow ? 38 : 56}
            tickMargin={narrow ? 4 : 6}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ fontWeight: 600, marginBottom: 4, fontSize: narrow ? 12 : 13 }}
          />
          <Legend
            verticalAlign={narrow ? 'top' : 'bottom'}
            align="center"
            iconType="line"
            iconSize={narrow ? 12 : 14}
            wrapperStyle={{
              fontSize: narrow ? 10 : 12,
              paddingTop: narrow ? 0 : 10,
              paddingBottom: narrow ? 4 : 0,
              lineHeight: narrow ? 1.35 : 1.5,
              width: '100%'
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name={narrow ? 'Actual (MW)' : 'Actual Generation (MW)'}
            stroke="#3b82f6"
            strokeWidth={narrow ? 1.75 : 2}
            dot={false}
            activeDot={{ r: narrow ? 4 : 6 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="forecasted"
            name={narrow ? 'Forecast (MW)' : 'Forecasted Generation (MW)'}
            stroke="#10b981"
            strokeWidth={narrow ? 1.75 : 2}
            dot={false}
            activeDot={{ r: narrow ? 4 : 6 }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
