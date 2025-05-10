import { supabase } from '../supabase';
import { htmlToDocx } from '../../lib/htmlToDocx';
import { uploadDocx } from '../../lib/storage';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const { html, type, title, user_id } = (await req.json()) as {
    html: string;
    type: 'edit' | 'generate';
    title?: string;
    user_id: string;
  };
  if (!html || !type || !user_id) {
    return new Response('Bad Request', { status: 400 });
  }
  const docxBlob = htmlToDocx(html);
  try {
    const storagePath = await uploadDocx(user_id, docxBlob);
    const { data, error } = await supabase.from('documents').insert({
      type,
      title: title ?? 'untitled',
      user_id,
      html,
      docx_url: storagePath,
    }).select('*').single();
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
} 