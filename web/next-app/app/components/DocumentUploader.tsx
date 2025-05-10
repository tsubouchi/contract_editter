import React, { useRef, useState } from 'react';

export default function DocumentUploader() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [detail, setDetail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('detail', detail);
      if (file) formData.append('file', file);
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setMessage('資料を登録しました');
        setTitle(''); setSummary(''); setDetail(''); setFile(null);
      } else {
        setError(data.error || '登録に失敗しました');
      }
    } catch (e) {
      setError('登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4 bg-gray-50">
      <div className="font-bold text-lg mb-2">資料アップロード</div>
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder="タイトル"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder="概要（任意）"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />
      <textarea
        className="border rounded px-3 py-2 w-full"
        placeholder="詳細（HTML可, 任意）"
        value={detail}
        onChange={e => setDetail(e.target.value)}
        rows={4}
      />
      <div
        className="w-full h-24 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-600 cursor-pointer bg-white"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="pointer-events-none">ここにWord/HTMLファイルをドラッグ&ドロップ<br />またはクリックして選択</p>
        <input
          type="file"
          accept=".html,.docx,text/html,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {file && <div className="mt-2 text-sm text-blue-600">{file.name}</div>}
      </div>
      <button className="btn w-full" type="submit" disabled={loading}>登録</button>
      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
} 