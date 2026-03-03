'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rekisteröityminen epäonnistui');

      // Auto-login after register
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) {
        // Registration succeeded but auto-login failed; go to login page
        router.push('/login?registered=1');
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Jokin meni pieleen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Rekisteröidy</h1>
        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nimi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sähköposti</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salasana</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Rekisteröidytään…' : 'Rekisteröidy'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Onko sinulla jo tili?{' '}
          <Link href="/login" className="text-blue-700 hover:underline">
            Kirjaudu sisään
          </Link>
        </p>
      </div>
    </div>
  );
}
