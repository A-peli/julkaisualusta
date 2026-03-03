'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { IPost, IUser } from '@/types';

export default function HomePage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
    ]).then(([postsData, userData]) => {
      setPosts(postsData.posts || []);
      if (userData) setUser(userData.user);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän kirjoituksen?')) return;
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <p className="text-gray-500 text-center py-12">Ladataan…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kirjoitukset</h1>
        {user && (
          <Link href="/posts/create" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            Uusi kirjoitus
          </Link>
        )}
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">Ei vielä kirjoituksia.</p>
          {user ? (
            <Link href="/posts/create" className="text-blue-700 hover:underline">
              Luo ensimmäinen kirjoitus
            </Link>
          ) : (
            <Link href="/register" className="text-blue-700 hover:underline">
              Rekisteröidy kirjoittaaksesi
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} currentUser={user} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
