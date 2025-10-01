import React from 'react';

interface Props { content: string; isOwn: boolean; timestamp: string; pending?: boolean }

export const MessageBubble: React.FC<Props> = ({ content, isOwn, timestamp, pending }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-xl shadow-md break-words text-sm relative ${isOwn ? 'bg-[#8A784E] text-[#E7EFC7]' : 'bg-[#AEC8A4] text-[#3B3B1A]'} ${pending ? 'opacity-60' : ''}`}>
        <p>{content}</p>
        <span className="block text-[10px] opacity-70 mt-1">{new Date(timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}{pending && ' • sending'}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
