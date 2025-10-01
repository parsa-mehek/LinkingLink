import { supabase } from '../lib/supabaseClient';

export const chatService = {
  async send(receiverId: string, content: string) {
    const { data, error } = await supabase.from('messages').insert({ receiver_id: receiverId, content }).select().single();
    return { data, error };
  },
  typingChannel: null as ReturnType<typeof supabase.channel> | null,
  ensureTypingChannel() {
    if (!this.typingChannel) {
      this.typingChannel = supabase.channel('typing');
      this.typingChannel.subscribe();
    }
    return this.typingChannel;
  },
  sendTyping(toUserId: string, fromUserId: string) {
    const ch = this.ensureTypingChannel();
    ch.send({ type: 'broadcast', event: 'typing', payload: { user_id: fromUserId, to: toUserId } });
  },
  async history(withUserId: string, limit = 30, before?: string) {
    // Fetch messages involving the current auth user & peer (server-side RLS restricts to own messages)
    let query = supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${withUserId}),and(receiver_id.eq.${withUserId}))`)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (before) query = query.lt('created_at', before);
    const { data, error } = await query;
    if (data) data.reverse(); // return ascending order
    return { data, error };
  },
  async markRead(peerId: string) {
    // Upsert read timestamp for current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated'), data: null };
    const { data, error } = await supabase.from('message_reads').upsert({ user_id: user.id, peer_id: peerId, last_read_at: new Date().toISOString() }, { onConflict: 'user_id,peer_id' }).select().single();
    return { data, error };
  },
  async getUnreadCounts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated'), data: null };
    // Retrieve all peers with last_read_at and compute unread by counting messages newer than last_read_at
    const { data: reads } = await supabase.from('message_reads').select('*').eq('user_id', user.id);
    const map: Record<string, number> = {};
    if (reads) {
      for (const r of reads) {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('sender_id', r.peer_id)
          .eq('receiver_id', user.id)
          .gt('created_at', r.last_read_at);
        map[r.peer_id] = count || 0;
      }
    }
    return { data: map, error: null };
  },
  async touchPresence(status: 'online' | 'offline' = 'online') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('presence').upsert({ user_id: user.id, status, last_seen_at: new Date().toISOString() });
  },
  async getPresence(userIds: string[]) {
    if (!userIds.length) return { data: [], error: null };
    const { data, error } = await supabase.from('presence').select('*').in('user_id', userIds);
    return { data, error };
  },
  subscribe(onInsert: (payload: any) => void) {
    const channel = supabase
      .channel('messages-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, onInsert)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }
};
