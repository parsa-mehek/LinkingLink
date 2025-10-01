import React, { useState } from 'react';
import { postsService } from 'services/postsService';

interface PostComposerProps {
  onCreated?: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await postsService.create(content.trim());
    if (error) setError(error.message);
    else {
      setContent('');
      onCreated?.();
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#AEC8A4] p-4 rounded-xl shadow-md">
      <textarea
        placeholder="Share your thoughts..."
        className="w-full p-3 rounded-lg border border-[#3B3B1A] text-[#3B3B1A] focus:outline-none focus:ring-2 focus:ring-[#8A784E] bg-white min-h-[110px]"
        value={content}
        disabled={loading}
        onChange={e => setContent(e.target.value)}
      />
      {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={loading || !content.trim()}
          className="mt-3 px-6 py-2 bg-[#8A784E] disabled:opacity-50 text-[#E7EFC7] font-semibold rounded-lg hover:bg-[#3B3B1A] transition"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
