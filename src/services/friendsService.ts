import { supabase } from '../lib/supabaseClient';

export const friendsService = {
  async sendRequest(receiverId: string) {
    const { data, error } = await supabase.from('friends').insert({ receiver_id: receiverId });
    return { data, error };
  },
  async respondRequest(id: string, status: 'accepted' | 'declined') {
    const { data, error } = await supabase.from('friends').update({ status }).eq('id', id);
    return { data, error };
  },
  async list() {
    const { data, error } = await supabase.from('friends').select('*');
    return { data, error };
  }
};
