import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-brand-600 to-brand-400 text-transparent bg-clip-text">
          Study Together. Grow Faster.
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          LinkingLink helps students collaborate, track progress, share notes, and stay motivated with friends.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="px-6 py-3 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-700 shadow">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-md bg-slate-200 text-slate-800 font-medium hover:bg-slate-300">
            Login
          </Link>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-lg bg-white shadow border">
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-slate-600">Visualize study hours, scores, and topics to maintain streaks.</p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow border">
            <h3 className="font-semibold mb-2">Collaborate & Chat</h3>
            <p className="text-sm text-slate-600">Realtime messaging keeps your study group in sync.</p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow border">
            <h3 className="font-semibold mb-2">Share Notes</h3>
            <p className="text-sm text-slate-600">Central repository for organized learning resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
