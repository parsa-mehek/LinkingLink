import React, { useState } from 'react';
import { notesService } from '../../services/notesService';

interface Props { onUploaded: () => void; }

type Mode = 'file' | 'link';

const NotesUploader: React.FC<Props> = ({ onUploaded }) => {
  const [subject, setSubject] = useState('');
  const [mode, setMode] = useState<Mode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSubject('');
    setFile(null);
    setLink('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    if (mode === 'file' && !file) return;
    if (mode === 'link' && !link.trim()) return;
    setUploading(true);
    setError(null);
    const { error } = mode === 'file'
      ? await notesService.upload(subject.trim(), file!)
      : await notesService.uploadLink(subject.trim(), link.trim());
    setUploading(false);
    if (error) {
      setError(error.message);
    } else {
      reset();
      onUploaded();
    }
  };

  return (
    <form onSubmit={submit} className="bg-[#AEC8A4]/60 backdrop-blur-sm border border-[#AEC8A4] rounded-xl p-4 md:p-5 shadow flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
        <label className="flex flex-col text-sm font-medium w-full md:w-64">
          <span className="mb-1 text-[#3B3B1A]">Subject / Topic</span>
          <input
            type="text"
            value={subject}
            onChange={e=>setSubject(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A784E]"
            placeholder="e.g. Data Structures"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium">
          <span className="mb-1 text-[#3B3B1A] flex gap-2 items-center">
            <select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#8A784E] bg-white">
              <option value="file">File</option>
              <option value="link">Link</option>
            </select>
          </span>
          {mode === 'file' ? (
            <input
              type="file"
              onChange={e=>setFile(e.target.files?.[0] || null)}
              className="text-xs"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt"
              required
            />
          ) : (
            <input
              type="url"
              value={link}
              onChange={e=>setLink(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A784E]"
              placeholder="https://example.com/notes.pdf"
              required
            />
          )}
        </label>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            disabled={uploading}
            className="bg-[#8A784E] hover:bg-[#3B3B1A] text-[#E7EFC7] text-sm px-4 py-2 rounded disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-[#8A784E]/60"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button type="button" onClick={reset} className="text-xs underline text-[#3B3B1A]/70 hover:text-[#3B3B1A]">Reset</button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-[11px] text-[#3B3B1A]/70">Accepted: PDF, DOCX, images, TXT. Links must be reachable URLs.</p>
    </form>
  );
};

export default NotesUploader;
