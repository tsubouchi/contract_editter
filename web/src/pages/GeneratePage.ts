import { generateHtml } from '../../app/lib/htmlGenerate';
import { htmlToDocx } from '../../app/lib/htmlToDocx';
import { PreviewPane } from '../components/PreviewPane';

export function GeneratePage(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-4 w-full max-w-2xl mx-auto';

  const textarea = document.createElement('textarea');
  textarea.className = 'border border-black p-2 h-40';
  textarea.placeholder = '生成要件を入力...';

  const generateBtn = document.createElement('button');
  generateBtn.textContent = 'Generate';
  generateBtn.className = 'btn w-32';

  const preview = PreviewPane();

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'DL DOCX';
  downloadBtn.className = 'btn w-32 hidden';

  generateBtn.addEventListener('click', async () => {
    preview.innerHTML = '';
    wrapper.appendChild(preview);
    const stream = generateHtml(textarea.value);
    // note: generateHtml returns Promise<string>, convert to stream: create single chunk
    preview.appendStream((async function* () { yield await stream; })());
    downloadBtn.classList.add('hidden');
    const html = await stream;
    const docxBlob = htmlToDocx(html);
    downloadBtn.onclick = () => {
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated.docx';
      a.click();
      URL.revokeObjectURL(url);
    };
    downloadBtn.classList.remove('hidden');
  });

  wrapper.append(textarea, generateBtn, preview, downloadBtn);
  return wrapper;
} 