import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface ProgressPoint { date: string; hours: number }

export const ProgressChart: React.FC<{ data: ProgressPoint[]; loading?: boolean }> = ({ data, loading }) => {
  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-[#3B3B1A] mb-2">Study Hours Over Time</h2>
      {loading ? <p className="text-sm text-[#3B3B1A]/70">Loading...</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#3B3B1A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#3B3B1A" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#8A784E" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressChart;
