import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const SUPABASE_URL = 'https://dbbodloajfqkrihzvhok.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || '';
const BUCKET = 'docx';
const JWT_SECRET = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export async function POST(req: NextRequest) {
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

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const detail = formData.get('detail') as string;
  const file = formData.get('file') as File | null;

  if (!title || !file) {
    return NextResponse.json({ error: 'titleとfileは必須です' }, { status: 400 });
  }

  // Storageにアップロード
  const filePath = `${crypto.randomUUID()}_${file.name}`;
  const { data: storageData, error: storageError } = await supabase.storage.from(BUCKET).upload(filePath, file, { upsert: true });
  if (storageError) {
    return NextResponse.json({ error: 'Storage upload failed', detail: storageError.message }, { status: 500 });
  }
  const file_url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

  // DBに登録
  const { data: doc, error: dbError } = await supabase.from('documents').insert([
    { title, summary, detail, file_url, user_id }
  ]).select().single();
  if (dbError) {
    return NextResponse.json({ error: 'DB insert failed', detail: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, document: doc });
} 