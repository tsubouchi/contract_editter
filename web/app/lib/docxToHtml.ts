import mammoth from 'mammoth/mammoth.browser';

/**
 * `.docx` ファイルを HTML 文字列へ変換
 * @param file DOCX File
 */
export async function docxToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.convertToHtml({ arrayBuffer });
  return value;
} 