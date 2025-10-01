import React, { useState } from 'react';
import { postsService } from 'services/postsService';
import clsx from 'clsx';

export interface PostRecord {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { name?: string } | null;
  likes?: { id: string; user_id: string }[];
  comments?: { id: string; content: string; user_id: string }[];
}

interface PostCardProps {
  post: PostRecord;
  currentUserId?: string | null;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const [likeBusy, setLikeBusy] = useState(false);
  const liked = !!post.likes?.some(l => l.user_id === currentUserId);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const onLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    await postsService.like(post.id);
    setLikeBusy(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-bold text-[#3B3B1A] mb-2">{post.profiles?.name || 'User'}</h3>
      <p className="text-[#3B3B1A] whitespace-pre-wrap">{post.content}</p>
      <div className="flex gap-4 mt-3 text-sm items-center">
        <button
          onClick={onLike}
            className={clsx('px-3 py-1 rounded-lg transition', liked ? 'bg-[#8A784E] text-white' : 'bg-[#AEC8A4] hover:bg-[#8A784E] hover:text-white', likeBusy && 'opacity-60')}
          disabled={likeBusy}
        >
          Like {likeCount ? `(${likeCount})` : ''}
        </button>
        <div className="px-3 py-1 rounded-lg bg-[#AEC8A4] text-[#3B3B1A]">Comments {commentCount ? `(${commentCount})` : ''}</div>
        <time className="ml-auto text-xs text-[#3B3B1A]/70" dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
      </div>
    </div>
  );
};

export default PostCard;
