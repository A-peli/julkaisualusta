'use client';

import Link from 'next/link';
import { IPost, IUser } from '@/types';

interface PostCardProps {
  post: IPost;
  currentUser?: IUser | null;
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, currentUser, onDelete }: PostCardProps) {
  const isAuthor = currentUser && post.author._id === currentUser._id;
  const preview = post.content.length > 150 ? post.content.slice(0, 150) + '…' : post.content;
  const date = new Date(post.createdAt).toLocaleDateString('fi-FI');

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/posts/${post._id}`} className="block">
        <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors mb-1">
          {post.title}
        </h2>
      </Link>
      <p className="text-xs text-gray-500 mb-2">
        {post.author.name} &bull; {date}
      </p>
      <p className="text-gray-700 text-sm leading-relaxed">{preview}</p>
      {isAuthor && (
        <div className="mt-3 flex gap-2">
          <Link
            href={`/posts/${post._id}/edit`}
            className="text-xs px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Muokkaa
          </Link>
          <button
            onClick={() => onDelete?.(post._id)}
            className="text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          >
            Poista
          </button>
        </div>
      )}
    </article>
  );
}
