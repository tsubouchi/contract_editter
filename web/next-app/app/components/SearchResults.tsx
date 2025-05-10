import React from 'react';

type Result = {
  id: string;
  title: string;
  summary?: string;
  detail?: string;
  file_url?: string;
  created_at?: string;
};

type SearchResultsProps = {
  results: Result[];
  onSelect: (doc: Result) => void;
  onEdit?: (doc: Result) => void;
  onDelete?: (doc: Result) => void;
  loading?: boolean;
};

export default function SearchResults({ results, onSelect, onEdit, onDelete, loading }: SearchResultsProps) {
  if (loading) return <div className="text-gray-500">検索中...</div>;
  if (!results.length) return <div className="text-gray-400">検索結果がありません</div>;
  return (
    <ul className="space-y-2">
      {results.map(doc => (
        <li key={doc.id} className="border rounded p-3 cursor-pointer hover:bg-gray-100 group">
          <div className="flex justify-between items-center">
            <div onClick={() => onSelect(doc)} className="flex-1">
              <div className="font-bold text-lg">{doc.title}</div>
              {doc.summary && <div className="text-sm text-gray-600 mb-1">{doc.summary}</div>}
              <div className="text-xs text-gray-400">{doc.created_at}</div>
            </div>
            <div className="flex gap-1 ml-2 opacity-80 group-hover:opacity-100">
              {onEdit && <button className="btn px-2 py-1 text-xs" onClick={e => { e.stopPropagation(); onEdit(doc); }}>編集</button>}
              {onDelete && <button className="btn px-2 py-1 text-xs bg-red-100 hover:bg-red-300" onClick={e => { e.stopPropagation(); onDelete(doc); }}>削除</button>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 