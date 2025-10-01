import { supabase } from '../lib/supabaseClient';

export const notesService = {
  async upload(subject: string, file: File) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: storageError } = await supabase.storage.from('notes').upload(path, file);
    if (storageError) return { error: storageError };
    const { data: publicUrl } = supabase.storage.from('notes').getPublicUrl(path);
    const { data, error } = await supabase.from('notes').insert({ subject, file_url: publicUrl.publicUrl }).select().single();
    return { data, error };
  },
  async uploadLink(subject: string, url: string) {
    // Basic validation safeguard; rely on form validation primarily
    try { new URL(url); } catch { return { error: { message: 'Invalid URL supplied' } as any }; }
    const { data, error } = await supabase.from('notes').insert({ subject, file_url: url }).select().single();
    return { data, error };
  },
  async list(subjectFilter?: string) {
    let query = supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (subjectFilter) query = query.ilike('subject', `%${subjectFilter}%`);
    const { data, error } = await query;
    return { data, error };
  }
};
