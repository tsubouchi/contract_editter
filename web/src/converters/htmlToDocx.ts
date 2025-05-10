import htmlDocx from 'html-docx-js/dist/html-docx';
import { saveAs } from 'file-saver';

/**
 * HTML 文字列を DOCX Blob に変換し返却する。呼び出し側で FileSaver 等に渡してダウンロード可能。
 */
export async function htmlToDocx(html: string): Promise<Blob> {
  // `html-docx-js` は非同期処理不要だが、将来的に Worker 化を見据えて Promise でラップ
  const converted = htmlDocx.asBlob(html);
  return converted;
}

/**
 * 直接ダウンロードまで行うユーティリティ
 */
export function downloadDocx(html: string, filename = 'document.docx') {
  const blob = htmlDocx.asBlob(html);
  saveAs(blob, filename);
} 