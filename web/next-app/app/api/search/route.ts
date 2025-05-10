// Supabase MCP検索API雛形

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_MCP_URL = 'https://dbbodloajfqkrihzvhok.supabase.co/mcp/v1/search';
const SUPABASE_MCP_TOKEN = 'sbp_9b90e5ab73e1c568aabda1b2ba8098bc2de7e95c';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 });

  // MCP REST APIへ問い合わせ
  const res = await fetch(SUPABASE_MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_MCP_TOKEN}`,
    },
    body: JSON.stringify({
      table: 'documents',
      column: 'detail', // 検索対象カラム
      query,
      topK: 10,
      includeMetadata: true,
    }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
