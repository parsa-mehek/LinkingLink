import { supabase } from '../lib/supabaseClient';

export interface ProgressEntry {
  id: string;
  user_id: string;
  date: string; // ISO date
  hours: number;
  topic: string;
  score?: number | null;
}

export const progressService = {
  async add(entry: { date: string; hours: number; topic: string; score?: number }) {
    const { data, error } = await supabase.from('progress').insert(entry).select().single();
    return { data, error };
  },
  async list() {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .order('date', { ascending: true });
    return { data: (data as ProgressEntry[]) || [], error };
  },
  aggregateHours(entries: ProgressEntry[]) {
    const byDate: Record<string, number> = {};
    for (const e of entries) {
      byDate[e.date] = (byDate[e.date] || 0) + (e.hours || 0);
    }
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, hours]) => ({ date, hours }));
  },
  aggregateTopics(entries: ProgressEntry[]) {
    const byTopic: Record<string, number> = {};
    for (const e of entries) {
      const key = e.topic || 'Unknown';
      byTopic[key] = (byTopic[key] || 0) + (e.hours || 0);
    }
    return Object.entries(byTopic)
      .map(([topic, value]) => ({ topic, value }))
      .sort((a, b) => b.value - a.value);
  }
};
