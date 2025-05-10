export interface StreamableElement extends HTMLElement {
  appendStream: (it: AsyncIterable<string>) => void;
}

export function PreviewPane(): StreamableElement {
  const container = document.createElement('div');
  container.className = 'w-full border border-black p-4 overflow-y-auto whitespace-pre-wrap h-80';

  /**
   * ストリーミングされたテキストをタイプライター風に表示
   */
  function appendStream(textStream: AsyncIterable<string>) {
    (async () => {
      for await (const chunk of textStream) {
        renderChunk(chunk);
      }
    })();
  }

  function renderChunk(chunk: string) {
    const span = document.createElement('span');
    span.className = 'typewriter';
    span.textContent = chunk;
    container.appendChild(span);
    container.scrollTop = container.scrollHeight;
  }

  return Object.assign(container, { appendStream });
} 