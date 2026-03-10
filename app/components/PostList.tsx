"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

// Interface lomakkeen datalle (ilman _id ja createdAt)
interface PostFormData {
  _id?: string;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lataa postaukset sivun latauduttua
  useEffect(() => {
    fetchPosts();
  }, []);

  // Hae kaikki postaukset API:sta
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/posts");

      if (!response.ok) {
        throw new Error("Postausten lataaminen epäonnistui");
      }

      const data = await response.json();
      setPosts(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tuntematon virhe tapahtui",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Luo tai päivitä postaus
  const handleSubmit = async (post: PostFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Jos muokataan olemassa olevaa postausta
      if (editingPost && editingPost._id) {
        const response = await fetch(`/api/posts/${editingPost._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        });

        if (!response.ok) {
          throw new Error("Postaauksen päivittäminen epäonnistui");
        }

        // Päivitä postaus listassa
        setPosts((prev) =>
          prev.map((p) =>
            p._id === editingPost._id
              ? { ...p, ...post, createdAt: p.createdAt }
              : p,
          ),
        );
        setEditingPost(null);
      } else {
        // Luo uusi postaus
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        });

        if (!response.ok) {
          throw new Error("Postaauksen luominen epäonnistui");
        }

        const data = await response.json();
        // Lisää uusi postaus listan alkuun
        setPosts((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tuntematon virhe tapahtui",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Poista postaus
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Postaauksen poistaminen epäonnistui");
      }

      // Poista postaus listasta
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tuntematon virhe tapahtui",
      );
    }
  };

  // Aloita postaauksen muokkaaminen
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    // Skrollaa lomakkeen yläpuolelle
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Peruuta muokkaaminen
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Postaukset</h1>

      {/* Virheilmoitus */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Lomake */}
      <PostForm
        onSubmit={handleSubmit}
        initialPost={editingPost}
        isLoading={isSubmitting}
      />

      {/* Peruuta muokkaaminen nappi */}
      {editingPost && (
        <button
          onClick={handleCancelEdit}
          className="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Peruuta muokkaaminen
        </button>
      )}

      {/* Lataa anim */}
      {isLoading && (
        <div className="text-center text-gray-500">Ladataan postauksia...</div>
      )}

      {/* Ei postauksia */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center text-gray-500">
          Ei vielä postauksia. Luo ensimmäinen!
        </div>
      )}

      {/* Postausten lista */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
