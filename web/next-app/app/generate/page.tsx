import React, { useState, useRef } from 'react';
import DropZone from '../components/DropZone';
import { htmlToDocxBlob } from '../../lib/htmlToDocx';

export default function GeneratePage() {
  const [preview, setPreview] = useState('');
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!preview) return;
    const blob = htmlToDocxBlob(preview);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPreview('');
    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: requirement, html: preview }),
      });
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        result += chunk;
        setPreview(result);
        setTimeout(() => {
          previewRef.current?.scrollTo(0, previewRef.current.scrollHeight);
        }, 0);
      }
    } catch (e) {
      setError('LLM API呼び出しに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">文書生成ページ</h1>
      <DropZone onFileLoaded={(_file, content) => setPreview(content)} />
      <textarea
        className="w-full border rounded p-2 mb-4 mt-4"
        rows={4}
        placeholder="ユーザー要件を入力"
        value={requirement}
        onChange={e => setRequirement(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
        <button className="btn" onClick={handleGenerate} disabled={loading}>Generate</button>
      </div>
      {loading && <div className="text-gray-500 mb-2">LLM応答待ち...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div ref={previewRef} className="w-full h-48 border p-4 overflow-y-auto whitespace-pre-wrap bg-white">
        <span className="typewriter">{preview}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn" onClick={handleDownload}>DL DOCX</button>
      </div>
    </main>
  );
} 