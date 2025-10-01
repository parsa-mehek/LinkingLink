import React, { useEffect, useState, useCallback } from 'react';
import PostComposer from 'components/PostComposer';
import PostCard, { PostRecord } from 'components/PostCard';
import { postsService } from 'services/postsService';
import { useAuth } from 'components/AuthProvider';

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await postsService.list();
    if (error) setError(error.message);
    else setPosts((data as any[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const unsub = postsService.subscribe(() => load());
    return () => unsub();
  }, [load]);

  return (
    <div className="min-h-screen bg-[#E7EFC7] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <PostComposer onCreated={load} />
        {loading && <p className="text-center text-[#3B3B1A]">Loading feed...</p>}
        {error && <p className="text-center text-red-700">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-[#3B3B1A]">No posts yet — be the first to share something!</p>
        )}
        <div className="space-y-4">
          {posts.map(p => (
            <PostCard key={p.id} post={p} currentUserId={user?.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
