import { supabase } from './supabase';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const { query } = (await req.json()) as { query: string };
  if (!query) {
    return new Response('query required', { status: 400 });
  }
  const token = (process.env.SUPABASE_MCP_TOKEN || (import.meta as any).env.SUPABASE_MCP_TOKEN) as string;

  const { data, error } = await supabase.rpc('mcp_match_documents', {
    query_text: query,
    match_count: 10,
    token,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

 