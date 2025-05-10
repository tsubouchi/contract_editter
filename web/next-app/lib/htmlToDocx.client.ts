export async function htmlToDocxBlob(html: string): Promise<Blob> {
  const htmlDocx = (await import('html-docx-js')).default;
  const docx = htmlDocx.asBlob(html);
  return docx;
}
