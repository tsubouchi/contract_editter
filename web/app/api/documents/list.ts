import { supabase } from '../supabase';
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const userId = new URL(req.url).searchParams.get('user_id');
  if (!userId) return new Response('user_id required', { status: 400 });
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
} 