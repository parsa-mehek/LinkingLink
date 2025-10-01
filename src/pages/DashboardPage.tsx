import React, { useEffect, useState, useCallback } from 'react';
import { progressService, ProgressEntry } from '../services/progressService';
import { ProgressChart } from '../components/analytics/ProgressChart';
import { TopicBreakdown } from '../components/analytics/TopicBreakdown';
import { Leaderboard } from '../components/analytics/Leaderboard';
import { StreakCard } from '../components/analytics/StreakCard';
import { supabase } from '../lib/supabaseClient';

interface Leader { user_id: string; hours: number; name?: string | null }

export const DashboardPage: React.FC = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [daily, setDaily] = useState<{ date: string; hours: number }[]>([]);
  const [topics, setTopics] = useState<{ topic: string; value: number }[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderLoading, setLeaderLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await progressService.list();
    if (error) setError(error.message); else {
      setEntries(data);
      setDaily(progressService.aggregateHours(data));
      setTopics(progressService.aggregateTopics(data));
    }
    setLoading(false);
  }, []);

  const loadLeaderboard = useCallback(async () => {
    setLeaderLoading(true);
    // aggregated query: sum hours per user (assuming progress table columns: user_id or user_id alias). Our ProgressEntry has user_id.
    const { data, error } = await supabase
      .from('progress')
      .select('user_id, hours, profiles!inner(name)') as any; // we'll aggregate client-side due lack of SQL views here
    if (!error && data) {
      const totals: Record<string, { hours: number; name?: string | null }> = {};
      (data as any[]).forEach(r => {
        if (!totals[r.user_id]) totals[r.user_id] = { hours: 0, name: r.profiles?.name };
        totals[r.user_id].hours += r.hours || 0;
      });
      const arr = Object.entries(totals).map(([user_id, v]) => ({ user_id, hours: Math.round(v.hours * 100)/100, name: v.name }));
      arr.sort((a,b) => b.hours - a.hours);
      setLeaders(arr.slice(0,5));
    }
    setLeaderLoading(false);
  }, []);

  useEffect(() => { refresh(); loadLeaderboard(); }, [refresh, loadLeaderboard]);

  const totalHours = daily.reduce((sum, d) => sum + d.hours, 0);
  const streak = (() => {
    if (!daily.length) return 0;
    const set = new Set(daily.map(d => d.date));
    let cnt = 0;
    let cursor = new Date();
    while (true) {
      const iso = cursor.toISOString().slice(0,10);
      if (set.has(iso)) { cnt++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
    return cnt;
  })();

  return (
    <div className="min-h-screen bg-[#E7EFC7] p-6 -mx-4 sm:mx-0">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#3B3B1A]">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressChart data={daily} loading={loading} />
          <TopicBreakdown data={topics} loading={loading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Leaderboard data={leaders} loading={leaderLoading} />
          <StreakCard streak={streak} totalHours={totalHours} loading={loading} />
        </div>
        {error && <p className="text-sm text-red-600">Error: {error}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
