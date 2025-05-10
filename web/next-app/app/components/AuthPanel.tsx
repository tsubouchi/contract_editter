import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dbbodloajfqkrihzvhok.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AuthPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setMessage('確認メールを送信しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="mb-4 p-2 border rounded bg-green-50 flex items-center gap-2">
        <span>ログイン中: {user.email}</span>
        <button className="btn ml-2" onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleAuth} className="mb-4 p-2 border rounded bg-gray-50 flex flex-col gap-2 max-w-md">
      <div className="flex gap-2 mb-1">
        <button type="button" className={mode==='signIn'? 'btn bg-gray-200' : 'btn'} onClick={()=>setMode('signIn')}>サインイン</button>
        <button type="button" className={mode==='signUp'? 'btn bg-gray-200' : 'btn'} onClick={()=>setMode('signUp')}>サインアップ</button>
      </div>
      <input type="email" className="border rounded px-3 py-2" placeholder="メールアドレス" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" className="border rounded px-3 py-2" placeholder="パスワード" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={loading}>{mode==='signIn' ? 'サインイン' : 'サインアップ'}</button>
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-600">{message}</div>}
    </form>
  );
} 