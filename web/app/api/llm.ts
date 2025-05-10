import { GoogleGenAI } from '@google/genai';

/**
 * ストリームで Gemini から生成されたテキストを AsyncGenerator として返す。
 * @param input 任意の文字列 (HTML やテキスト)
 */
export async function* streamGenerate(input: string): AsyncGenerator<string, void, unknown> {
  const apiKey = import.meta.env.GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY が設定されていません');
  }

  const ai = new GoogleGenAI({ apiKey });

  const model = 'gemini-2.5-flash-preview-04-17';
  const contents = [
    {
      role: 'user',
      parts: [{ text: input }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config: { responseMimeType: 'text/plain' },
    contents,
  });

  for await (const chunk of response) {
    yield chunk.text;
  }
} 