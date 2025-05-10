/**
 * Word 編集用プロンプトを生成
 */
export function buildEditPrompt(html: string, instructions: string): string {
  return `あなたは熟練した編集者です。以下の HTML コンテンツを Word とみなし、ユーザーの指示に従って修正してください。\n\n### 元コンテンツ\n${html}\n\n### 指示\n${instructions}\n\n### 出力条件\n- 完全な HTML 文字列\n- 指定がない限りレイアウトは保持\n- 変更箇所がわかるようコメントを挿入しない`;
}

/**
 * 文書生成用プロンプトを生成
 */
export function buildGeneratePrompt(requirement: string): string {
  return `あなたは優秀なテクニカルライターです。以下の要件に基づき、Word 互換の HTML ドキュメントを作ってください。\n\n## 要件\n${requirement}\n\n## 出力フォーマット\n- <html> から始まる完全な HTML 文字列\n- inline CSS でスタイル指定\n- 日本語`;
} 