import { supabase } from '../supabase';
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return new Response('id required', { status: 400 });
  const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
} 