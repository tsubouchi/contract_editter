import { htmlToDocx } from '../converters/htmlToDocx';

export function DropZone(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'w-full max-w-xl flex flex-col items-center';

  const zone = document.createElement('div');
  zone.className = 'w-full h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-600 cursor-pointer bg-white';
  zone.innerHTML = '<p class="pointer-events-none">ここに HTML ファイルをドラッグ & ドロップ<br>またはクリックして選択</p>';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.html,text/html';
  fileInput.hidden = true;

  zone.addEventListener('click', () => fileInput.click());

  const preventDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  (['dragenter', 'dragover', 'dragleave', 'drop'] as const).forEach((ev) => {
    zone.addEventListener(ev, preventDefaults as EventListener);
  });

  (['dragenter', 'dragover'] as const).forEach((ev) => {
    zone.addEventListener(ev, () => zone.classList.add('border-blue-500'));
  });

  (['dragleave', 'drop'] as const).forEach((ev) => {
    zone.addEventListener(ev, () => zone.classList.remove('border-blue-500'));
  });

  zone.addEventListener('drop', (e) => {
    const dt = (e as DragEvent).dataTransfer;
    if (!dt) return;
    handleFiles(Array.from(dt.files));
  });

  fileInput.addEventListener('change', () => {
    handleFiles(Array.from(fileInput.files || []));
  });

  async function handleFiles(files: File[]) {
    const htmlFile = files.find((f) => f.type === 'text/html' || f.name.endsWith('.html'));
    if (!htmlFile) {
      alert('HTML ファイルを選択してください');
      return;
    }

    const html = await htmlFile.text();
    const blob = await htmlToDocx(html);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = htmlFile.name.replace(/\.html?$/i, '.docx');
    a.click();
    URL.revokeObjectURL(url);
  }

  container.appendChild(zone);
  container.appendChild(fileInput);
  return container;
} 