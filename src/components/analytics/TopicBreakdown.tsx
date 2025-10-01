import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface TopicSlice { topic: string; value: number }
const COLORS = ['#8A784E', '#3B3B1A', '#d4c29a', '#705f35', '#c7b07a'];

export const TopicBreakdown: React.FC<{ data: TopicSlice[]; loading?: boolean }> = ({ data, loading }) => {
  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-[#3B3B1A] mb-2">Topic Breakdown</h2>
      {loading ? <p className="text-sm text-[#3B3B1A]/70">Loading...</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="topic" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={entry.topic + index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopicBreakdown;
