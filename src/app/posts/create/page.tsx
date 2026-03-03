'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = async (title: string, content: string) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Julkaisu epäonnistui');
    router.push(`/posts/${data.post._id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Uusi kirjoitus</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}
