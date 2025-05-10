import htmlDocx from 'html-docx-js';

export function htmlToDocxBlob(html: string): Blob {
  const docx = htmlDocx.asBlob(html);
  return docx;
} 