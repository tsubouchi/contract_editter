import { createClient } from '@supabase/supabase-js';

// プロセス実行環境と Vite 環境双方に対応 (globalThis.process は Node でのみ存在)
const env = (globalThis as any).process?.env ?? (import.meta as any).env;
const supabaseUrl = env.SUPABASE_URL as string;
const supabaseAnon = env.SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnon); 