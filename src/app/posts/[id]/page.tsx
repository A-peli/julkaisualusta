'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { IPost, IUser } from '@/types';

export default function PostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<IPost | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null)),
    ]).then(([postData, userData]) => {
      if (!postData) setNotFound(true);
      else setPost(postData.post);
      if (userData) setUser(userData.user);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Haluatko varmasti poistaa tämän kirjoituksen?')) return;
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  };

  if (loading) return <p className="text-gray-500 text-center py-12">Ladataan…</p>;
  if (notFound || !post) return <p className="text-center py-12 text-gray-500">Kirjoitusta ei löydy.</p>;

  const isAuthor = user && post.author._id === user._id;
  const date = new Date(post.createdAt).toLocaleDateString('fi-FI');

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <Link href="/" className="text-sm text-blue-700 hover:underline mb-4 inline-block">
        ← Takaisin
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {post.author.name} &bull; {date}
      </p>
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</div>
      {isAuthor && (
        <div className="mt-8 flex gap-3">
          <Link
            href={`/posts/${id}/edit`}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors"
          >
            Muokkaa
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium transition-colors"
          >
            Poista
          </button>
        </div>
      )}
    </article>
  );
}
