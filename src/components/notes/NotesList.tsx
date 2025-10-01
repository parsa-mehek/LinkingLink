import React from 'react';
import NoteCard from './NoteCard';

export interface NoteItem {
  id: string;
  subject: string;
  file_url: string;
  created_at: string;
  uploader?: string;
}

interface Props {
  notes: NoteItem[];
  loading: boolean;
  error: string | null;
}

const NotesList: React.FC<Props> = ({ notes, loading, error }) => {
  if (loading) return <p className="text-sm text-[#3B3B1A]/70">Loading notes...</p>;
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;
  if (notes.length === 0) return <p className="text-sm text-[#3B3B1A]/60">No notes found.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {notes.map(n => (
        <NoteCard key={n.id} subject={n.subject} fileUrl={n.file_url} uploader={n.uploader} createdAt={n.created_at} />
      ))}
    </div>
  );
};

export default NotesList;
