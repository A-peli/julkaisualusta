"use client";
// imports
import { useState } from "react";

//Rakennetaan PostCard-komponentti, joka esittää yksittäisen postauksen tiedot ja tarjoaa muokkaus- ja poistotoiminnot.
interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => Promise<void>;
  onEdit: (post: Post) => void;
}

export default function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Päivämäärän muotoilu ja kellonaika
  const formattedDate = new Date(post.createdAt).toLocaleString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // poistaminen
  const handleDelete = async () => {
    if (
      window.confirm("Oletko varma, että haluat poistaa tämän postaauksen?")
    ) {
      setIsDeleting(true);
      try {
        await onDelete(post._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Otsikko */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>

      {/* Tekijä ja päivämäärä */}
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Tekijä: {post.author}</span>
        <span>{formattedDate}</span>
      </div>

      {/* Sisältö */}
      <p className="text-gray-700 mb-4">{post.content}</p>

      {/* Napit */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(post)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Muokkaa
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {isDeleting ? "Poistetaan..." : "Poista"}
        </button>
      </div>
    </div>
  );
}
