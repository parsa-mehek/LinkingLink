import React from 'react';
import { AppRoutes } from './routes';
import Navbar from 'components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from 'components/AuthProvider';

// Simple gate providing early visual feedback to avoid perceived "white page" during auth/env resolution.
const StartupGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const envMissing = !supabaseUrl || !supabaseKey;

  if (envMissing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E7EFC7] to-[#AEC8A4] p-6 text-center">
        <div className="max-w-md bg-white/90 backdrop-blur rounded-xl border border-[#AEC8A4] shadow p-6 space-y-4">
          <h1 className="text-xl font-semibold text-red-700">Environment Not Configured</h1>
          <p className="text-sm text-slate-700">Your Supabase variables are missing. Create a <code>.env</code> file with:</p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded text-left whitespace-pre-wrap">VITE_SUPABASE_URL=...\nVITE_SUPABASE_ANON_KEY=...</pre>
          <p className="text-xs text-slate-600">Then restart <code>npm run dev</code>.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E7EFC7] animate-fade-in">
        <div className="w-14 h-14 border-4 border-[#AEC8A4] border-t-[#8A784E] rounded-full animate-spin mb-6" aria-label="Loading" />
        <p className="text-sm font-medium text-[#3B3B1A] tracking-wide">Preparing your workspace...</p>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <StartupGate>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
            <AppRoutes />
          </main>
          <footer className="py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} LinkingLink</footer>
        </div>
      </StartupGate>
    </ErrorBoundary>
  );
};

export default App;
