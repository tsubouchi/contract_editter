import { supabase } from '../api/supabase';

/**
 * Uploads a Blob to Supabase Storage 'docx' bucket.
 * Returns the path in storage (key).
 */
export async function uploadDocx(userId: string, blob: Blob): Promise<string> {
  const key = `${userId}/${Date.now()}.docx`;
  const { error } = await supabase.storage.from('docx').upload(key, blob, {
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  if (error) throw error;
  return key;
} 