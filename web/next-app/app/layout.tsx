import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'HTML→Word変換Webアプリ',
  description: 'HTMLをWordに変換・要約・検索できるWebアプリ',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
} 