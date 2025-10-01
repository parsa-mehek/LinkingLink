import React from 'react';

export const TypingIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div className="text-xs text-[#3B3B1A] animate-pulse px-2 py-1">Typing...</div>
  );
};

export default TypingIndicator;
