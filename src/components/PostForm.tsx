'use client';

import { useState } from 'react';

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => Promise<void>;
  submitLabel?: string;
}

export default function PostForm({ initialTitle = '', initialContent = '', onSubmit, submitLabel = 'Julkaise' }: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(title, content);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Jokin meni pieleen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Otsikko</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kirjoituksen otsikko"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sisältö</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={10}
          rows={10}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Kirjoituksen sisältö..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="min-h-[44px] bg-blue-700 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-800 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Tallennetaan…' : submitLabel}
      </button>
    </form>
  );
}
