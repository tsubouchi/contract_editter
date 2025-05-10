import React, { useState } from 'react';
import AuthPanel from './components/AuthPanel';
import DropZone from './components/DropZone';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import PreviewPane from './components/PreviewPane';
import DocumentUploader from './components/DocumentUploader';
import { htmlToDocxBlob } from '../lib/htmlToDocx';

export default function HomePage() {
  const [preview, setPreview] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editFields, setEditFields] = useState({ title: '', summary: '', detail: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setSelectedDoc(null);
    setSearchResults([]);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      // MCPの返却形式に合わせて整形
      const docs = (data.results || []).map((r: any) => ({
        id: r.metadata?.id || r.id,
        title: r.metadata?.title || '',
        summary: r.metadata?.summary || '',
        detail: r.metadata?.detail || '',
        file_url: r.metadata?.file_url || '',
        created_at: r.metadata?.created_at || '',
      }));
      setSearchResults(docs);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    setEditFields({ title: doc.title, summary: doc.summary, detail: doc.detail });
    setEditError('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editingDoc) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`/api/documents/${editingDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFields),
      });
      const data = await res.json();
      if (data.ok) {
        setEditingDoc(null);
        setSearchResults(results => results.map(d => d.id === data.document.id ? data.document : d));
        setSelectedDoc(data.document);
      } else {
        setEditError(data.error || '更新に失敗しました');
      }
    } catch {
      setEditError('更新に失敗しました');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (doc: any) => {
    if (!doc?.id) return;
    await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' });
    setSearchResults(results => results.filter(d => d.id !== doc.id));
    if (selectedDoc?.id === doc.id) setSelectedDoc(null);
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <AuthPanel />
      <h1 className="text-2xl font-bold mb-4">HTML → Word 変換ツール</h1>
      <DocumentUploader />
      <hr className="my-8" />
      <DropZone onFileLoaded={(_file, content) => setPreview(content)} />
      <div className="flex gap-2 mb-4 mt-4">
        <button className="btn">変換</button>
        <button className="btn" onClick={handleDownload}>DL DOCX</button>
      </div>
      <PreviewPane content={preview} />
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-2">資料検索</h2>
      <SearchBar onSearch={handleSearch} loading={searchLoading} />
      <SearchResults
        results={searchResults}
        loading={searchLoading}
        onSelect={doc => {
          setSelectedDoc(doc);
          setPreview(doc.detail || '');
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {editingDoc && (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <div className="font-bold mb-2">資料編集（リアルタイム保存）</div>
          <input
            className="border rounded px-3 py-2 w-full mb-2"
            name="title"
            value={editFields.title}
            onChange={handleEditChange}
            placeholder="タイトル"
          />
          <input
            className="border rounded px-3 py-2 w-full mb-2"
            name="summary"
            value={editFields.summary}
            onChange={handleEditChange}
            placeholder="概要"
          />
          <textarea
            className="border rounded px-3 py-2 w-full mb-2"
            name="detail"
            value={editFields.detail}
            onChange={handleEditChange}
            placeholder="詳細"
            rows={4}
          />
          <div className="flex gap-2">
            <button className="btn" onClick={handleEditSave} disabled={editLoading}>保存</button>
            <button className="btn" onClick={() => setEditingDoc(null)} disabled={editLoading}>キャンセル</button>
          </div>
          {editError && <div className="text-red-500 mt-2">{editError}</div>}
        </div>
      )}
      {selectedDoc && !editingDoc && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <div className="font-bold text-lg mb-2">{selectedDoc.title}</div>
          <div className="text-sm text-gray-600 mb-2">{selectedDoc.summary}</div>
          <PreviewPane content={selectedDoc.detail || ''} />
          {selectedDoc.file_url && (
            <a href={selectedDoc.file_url} className="btn mt-2 inline-block" target="_blank" rel="noopener noreferrer">Wordファイルを開く</a>
          )}
        </div>
      )}
    </main>
  );
} 