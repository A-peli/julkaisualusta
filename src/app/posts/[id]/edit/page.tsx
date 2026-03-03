'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { IPost } from '@/types';

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPost(data.post);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (title: string, content: string) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tallennus epäonnistui');
    router.push(`/posts/${id}`);
  };

  if (loading) return <p className="text-gray-500 text-center py-12">Ladataan…</p>;
  if (!post) return <p className="text-center py-12 text-gray-500">Kirjoitusta ei löydy.</p>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Muokkaa kirjoitusta</h1>
      <PostForm
        initialTitle={post.title}
        initialContent={post.content}
        onSubmit={handleSubmit}
        submitLabel="Tallenna muutokset"
      />
    </div>
  );
}
