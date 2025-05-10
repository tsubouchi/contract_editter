import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const SUPABASE_URL = 'https://dbbodloajfqkrihzvhok.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const JWT_SECRET = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET as string;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // JWT検証
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: '認証情報がありません' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');
  let user_id;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    user_id = payload.sub;
  } catch (e) {
    return NextResponse.json({ error: 'JWT検証失敗' }, { status: 401 });
  }
  const id = params.id;
  const { title, summary, detail } = await req.json();
  const { data, error } = await supabase.from('documents').update({ title, summary, detail }).eq('id', id).eq('user_id', user_id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, document: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // JWT検証
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: '認証情報がありません' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');
  let user_id;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    user_id = payload.sub;
  } catch (e) {
    return NextResponse.json({ error: 'JWT検証失敗' }, { status: 401 });
  }
  const id = params.id;
  const { error } = await supabase.from('documents').delete().eq('id', id).eq('user_id', user_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
} 