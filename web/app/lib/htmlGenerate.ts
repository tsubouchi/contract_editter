import { streamGenerate } from '../api/llm';

/**
 * ユーザー要望をもとに Gemini へプロンプトを送り、Word 風レイアウトの HTML 文字列を生成して返す。
 * @param request 要件（例: "来期目標について A4 2枚程度の報告書を作成"）
 */
export async function generateHtml(request: string): Promise<string> {
  const prompt = buildPrompt(request);
  const chunks: string[] = [];
  for await (const text of streamGenerate(prompt)) {
    chunks.push(text);
  }
  return chunks.join('');
}

/**
 * LLM へ渡すシステムプロンプト / ユーザープロンプトを組み立てる簡易版
 */
function buildPrompt(requirement: string): string {
  return `あなたは優秀な技術ライターです。以下の要件を満たす Word 風の HTML ドキュメントを作成してください。\n\n## 要件\n${requirement}\n\n## 出力フォーマット\n- <html> から始まる完全な HTML 文字列\n- CSS は inline style を使用し、Word で貼り付けてもレイアウトが崩れにくいようにしてください。`;
} 