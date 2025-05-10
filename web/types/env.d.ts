/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GEMINI_API_KEY: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_MCP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 