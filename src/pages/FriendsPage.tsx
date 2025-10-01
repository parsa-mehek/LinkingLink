import React from 'react';

export const FriendsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E7EFC7] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-[#3B3B1A]">Friends</h1>
          <p className="text-sm text-[#3B3B1A]/70">Manage friend requests and connections (coming soon).</p>
        </header>
        <div className="card-muted">
          <p className="text-sm text-[#3B3B1A]/80">Feature placeholder: friend list, incoming requests, and search will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
