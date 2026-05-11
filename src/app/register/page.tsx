'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/login');
    } else {
      setError(data.error || '登録に失敗しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">会員登録</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {['name', 'address', 'phone', 'email', 'password'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {field === 'name' ? '名前' : field === 'address' ? '住所' : field === 'phone' ? '電話番号' : field === 'email' ? 'メールアドレス' : 'パスワード'}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          登録する
        </button>
        <p className="text-center mt-4 text-sm">
          すでにアカウントをお持ちの方は{' '}
          <a href="/login" className="text-blue-600 underline">ログイン</a>
        </p>
      </div>
    </div>
  );
}