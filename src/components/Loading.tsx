import React from 'react';

export const Loading: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="py-10 text-center text-slate-500 text-sm animate-pulse">{label}</div>
);
