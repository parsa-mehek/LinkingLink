import { supabase } from '../lib/supabaseClient';

export const postsService = {
  async create(content: string) {
    const { data, error } = await supabase.from('posts').insert({ content }).select().single();
    return { data, error };
  },
  async list() {
    const { data, error } = await supabase
      .from('posts')
      .select('id, content, created_at, user_id, profiles(name), comments(id, content, user_id), likes(id, user_id)')
      .order('created_at', { ascending: false });
    return { data, error };
  },
  async like(postId: string) {
    const { data, error } = await supabase.from('likes').insert({ post_id: postId }).select().single();
    return { data, error };
  },
  async comment(postId: string, content: string) {
    const { data, error } = await supabase.from('comments').insert({ post_id: postId, content }).select().single();
    return { data, error };
  },
  subscribe(onChange: () => void) {
    const channel = supabase
      .channel('posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => onChange())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

