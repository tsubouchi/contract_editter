import React, { useState } from 'react';

type SearchBarProps = {
  onSearch: (query: string) => void;
  loading?: boolean;
};

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        className="border rounded px-3 py-2 flex-1"
        placeholder="資料を自然言語で検索..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        disabled={loading}
      />
      <button className="btn" type="submit" disabled={loading}>検索</button>
    </form>
  );
} 