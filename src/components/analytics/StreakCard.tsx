import React from 'react';

export const StreakCard: React.FC<{ streak: number; totalHours: number; loading?: boolean }> = ({ streak, totalHours, loading }) => {
  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md flex flex-col">
      <h2 className="text-lg font-bold text-[#3B3B1A] mb-2">Study Streak</h2>
      {loading ? <p className="text-sm text-[#3B3B1A]/70">Loading...</p> : (
        <>
          <p className="text-2xl font-semibold text-[#8A784E]">🔥 {streak} day{streak===1?'':'s'}</p>
          <p className="text-xs text-[#3B3B1A]/70 mt-2">Based on recorded days with &gt; 0 hours.</p>
          <div className="mt-auto pt-4 text-sm text-[#3B3B1A]">Total Hours: <span className="font-semibold">{totalHours}</span></div>
        </>
      )}
    </div>
  );
};

export default StreakCard;
