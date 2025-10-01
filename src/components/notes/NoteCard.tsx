import React from 'react';

export interface NoteCardProps {
  subject: string;
  fileUrl: string;
  uploader?: string;
  createdAt?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ subject, fileUrl, uploader = 'Unknown', createdAt }) => {
  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <h3 className="font-bold text-[#3B3B1A] mb-1 line-clamp-2 break-words">{subject}</h3>
        <p className="text-[11px] text-[#3B3B1A]/80 mb-2">Uploaded by {uploader}</p>
        {createdAt && <p className="text-[10px] text-[#3B3B1A]/60 mb-4">{new Date(createdAt).toLocaleString()}</p>}
      </div>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto px-4 py-2 bg-[#8A784E] text-[#E7EFC7] rounded-lg hover:bg-[#3B3B1A] transition text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#3B3B1A]/60"
      >
        Open Note
      </a>
    </div>
  );
};

export default NoteCard;
