import React from 'react';

export const EnvWarning: React.FC = () => {
  const missing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!missing) return null;
  return (
    <div className="w-full bg-red-600 text-white text-xs text-center py-1">
      Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
    </div>
  );
};
