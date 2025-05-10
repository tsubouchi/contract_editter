import { PreviewPane } from '../components/PreviewPane';

export function PreviewPage(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'max-w-2xl mx-auto p-4';

  const pane = PreviewPane();
  wrapper.appendChild(pane);

  const id = new URL(location.href).searchParams.get('id');
  if (!id) {
    pane.textContent = 'No id';
    return wrapper;
  }

  (async () => {
    const res = await fetch(`/api/documents/get?id=${id}`);
    const doc = await res.json();
    pane.innerHTML = doc.html;
  })();

  return wrapper;
} 