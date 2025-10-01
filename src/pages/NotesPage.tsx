import React, { useEffect, useState, useCallback } from 'react';
import NotesUploader from '../components/notes/NotesUploader';
import NotesList from '../components/notes/NotesList';
import { notesService } from '../services/notesService';

interface NoteRow { id: string; subject: string; file_url: string; created_at: string; }

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  // Debounce subject filter for lightweight UX
  useEffect(() => {
    const id = setTimeout(()=> setDebouncedFilter(filter), 350);
    return () => clearTimeout(id);
  }, [filter]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await notesService.list(debouncedFilter || undefined);
    if (error) setError(error.message); else setNotes(data as NoteRow[]);
    setLoading(false);
  }, [debouncedFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-[#E7EFC7] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-[#3B3B1A]">Notes Repository</h1>
          <p className="text-sm text-[#3B3B1A]/70">Upload and share study notes (files or external links).</p>
        </header>
        <NotesUploader onUploaded={load} />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-semibold text-[#3B3B1A]">All Notes</h2>
          <input
            type="text"
            value={filter}
            onChange={e=>setFilter(e.target.value)}
            placeholder="Filter by subject..."
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A784E] bg-white"
          />
        </div>
        <div className="bg-[#AEC8A4]/40 border border-[#AEC8A4] rounded-xl p-5 shadow-sm">
          <NotesList notes={notes} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
