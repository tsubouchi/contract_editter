import { PreviewPane } from './PreviewPane';

export function SearchBar(onResult: (results: any[]) => void): HTMLElement {
  const form = document.createElement('form');
  form.className = 'flex gap-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '検索 (自然言語)...';
  input.className = 'border border-black px-2 py-1 w-full';

  const btn = document.createElement('button');
  btn.textContent = 'Search';
  btn.className = 'btn';

  form.append(input, btn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input.value }),
    });
    const data = await res.json();
    onResult(data);
  });

  return form;
} 