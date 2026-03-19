import React from 'react';
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

/**
 * ChartWidget receives data formatted as:
 * { timeStr: string, actual: number, forecasted: number | null }
 */
export default function ChartWidget({ data }) {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebedf0" />
          <XAxis 
            dataKey="timeStr" 
            tick={{ fill: '#64748b' }} 
            tickMargin={10} 
          />
          <YAxis 
            label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
            tick={{ fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Generation (MW)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="forecasted"
            name="Forecasted Generation (MW)"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            connectNulls={false} // Implicitly: If value is missing (undefined/null), it drops the line
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
