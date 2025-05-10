This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 運用・管理者向けガイド（日本語）

### 1. デプロイ・ビルド
- 本番デプロイ: `vercel --prod` またはVercelダッシュボードからデプロイ
- ビルド: `pnpm run build` でローカルビルド確認

### 2. 環境変数
- `.env.local` で以下を設定
  - `NEXT_PUBLIC_SUPABASE_URL`（SupabaseプロジェクトURL）
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（公開APIキー）
  - `SUPABASE_SERVICE_ROLE`（サーバー用ロールキー）
  - `NEXT_PUBLIC_SUPABASE_JWT_SECRET`（JWT検証用シークレット）
  - `GEMINI_API_KEY`（Gemini APIキー）
- Vercel/Supabaseの管理画面でも同様に設定

### 3. 認証・RLS
- Supabase Auth（メール/Google等）で認証
- API RouteでJWTを検証し、payloadの`sub`（user_id）をDBに保存
- Supabase側でRLS（Row Level Security）を有効化し、`auth.uid() = user_id` のポリシーを設定

### 4. バックアップ
- Supabaseの自動バックアップ機能を利用
- 重要データは定期的にエクスポート推奨

### 5. 障害対応
- Vercel/Supabaseのステータスページで障害情報を確認
- エラー発生時はVercelのビルドログ・Supabaseのログを確認
- JWT/認証エラー時は再ログイン・環境変数の再確認

### 6. その他
- MCP/SupabaseのAPIトークン・RLS設定・運用手順は本ガイドおよび開発仕様書参照
- 詳細な運用フローや障害時の連絡先は別途管理者用ドキュメントに記載

---
