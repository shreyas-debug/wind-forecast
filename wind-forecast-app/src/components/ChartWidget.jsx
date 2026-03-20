import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
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

  return (
    <div className={`chart-wrapper${narrow ? ' chart-wrapper--narrow' : ''} animate-fade-in`}>
      {narrow && (
        <p className="chart-axis-caption" aria-hidden="true">
          Power (MW)
        </p>
      )}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <AreaChart data={data} margin={margins}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="timeStr"
            tick={{
              fill: '#94a3b8',
              fontSize: compact ? 9 : narrow ? 10 : 11,
              fontWeight: 500
            }}
            tickMargin={narrow ? 6 : 12}
            tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
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
                    fill: '#94a3b8',
                    fontSize: 12,
                    fontWeight: 500
                  }
            }
            tick={{ fill: '#94a3b8', fontSize: narrow ? 9 : 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={narrow ? 38 : 60}
            tickMargin={narrow ? 4 : 8}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
            wrapperClassName="custom-tooltip"
            labelClassName="custom-tooltip-label"
            itemStyle={{ fontWeight: 700, fontSize: '1.05rem', padding: '2px 0' }}
          />
          <Legend
            verticalAlign={narrow ? 'top' : 'bottom'}
            align="center"
            iconType="circle"
            iconSize={narrow ? 8 : 10}
            wrapperStyle={{
              fontSize: narrow ? 10 : 13,
              fontWeight: 500,
              color: '#f8fafc',
              paddingTop: narrow ? 0 : 20,
              paddingBottom: narrow ? 4 : 0,
              width: '100%'
            }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name={narrow ? 'Actual (MW)' : 'Actual Generation (MW)'}
            stroke="#60a5fa"
            fillOpacity={1}
            fill="url(#colorActual)"
            strokeWidth={narrow ? 2 : 3}
            activeDot={{ r: narrow ? 4 : 6, stroke: '#60a5fa', strokeWidth: 3, fill: '#0b0f19' }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="forecasted"
            name={narrow ? 'Forecast (MW)' : 'Forecasted Generation (MW)'}
            stroke="#34d399"
            fillOpacity={1}
            fill="url(#colorForecast)"
            strokeWidth={narrow ? 2 : 3}
            activeDot={{ r: narrow ? 4 : 6, stroke: '#34d399', strokeWidth: 3, fill: '#0b0f19' }}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
