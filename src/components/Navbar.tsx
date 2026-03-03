'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';

export default function Navbar() {
  const [user, setUser] = useState<IUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (!cancelled && data) setUser(data.user); })
      .catch(() => null);
    return () => { cancelled = true; };
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = (
    <>
      <Link href="/" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>
        Etusivu
      </Link>
      {user && (
        <Link href="/posts/create" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>
          Uusi kirjoitus
        </Link>
      )}
      {!user && (
        <>
          <Link href="/login" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>
            Kirjaudu
          </Link>
          <Link href="/register" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>
            Rekisteröidy
          </Link>
        </>
      )}
      {user && (
        <button onClick={logout} className="hover:text-blue-600 transition-colors text-left">
          Kirjaudu ulos
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-blue-700">
          Julkaisualusta
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {navLinks}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-4 text-sm font-medium text-gray-700">
          {navLinks}
        </div>
      )}
    </nav>
  );
}
