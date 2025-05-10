import htmlDocx from 'html-docx-js/dist/html-docx';

/**
 * HTML 文字列を DOCX Blob に変換
 */
export function htmlToDocx(html: string): Blob {
  return htmlDocx.asBlob(html);
} 