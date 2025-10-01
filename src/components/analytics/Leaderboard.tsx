import React from 'react';

export interface LeaderRow { user_id: string; hours: number; name?: string | null }

export const Leaderboard: React.FC<{ data: LeaderRow[]; loading?: boolean }> = ({ data, loading }) => {
  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-[#3B3B1A] mb-2">Leaderboard</h2>
      {loading && <p className="text-sm text-[#3B3B1A]/70">Loading...</p>}
      {!loading && data.length === 0 && <p className="text-sm text-[#3B3B1A]/70">No entries yet.</p>}
      {!loading && data.length > 0 && (
        <ol className="text-sm space-y-1">
          {data.map((r, i) => (
            <li key={r.user_id} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-5 text-right">{i+1}.</span> {r.name || ('User ' + r.user_id.slice(0,6))}</span>
              <span className="font-semibold text-[#8A784E]">{r.hours}h</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
