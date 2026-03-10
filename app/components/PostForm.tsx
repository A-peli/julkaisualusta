"use client";

import { useState } from "react";

interface Post {
  _id?: string;
  title: string;
  content: string;
  author: string;
  createdAt?: string; // Lisää tämä rivi
}

interface PostFormProps {
  onSubmit: (post: Post) => Promise<void>;
  initialPost?: Post | null;
  isLoading?: boolean;
}

export default function PostForm({
  onSubmit,
  initialPost = null,
  isLoading = false,
}: PostFormProps) {
  // Lomakkeen oletus-arvot
  const [formData, setFormData] = useState<Post>({
    title: initialPost?.title || "",
    content: initialPost?.content || "",
    author: initialPost?.author || "",
  });

  // lomakkeen lähettäminen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // resetoi lomake
    setFormData({ title: "", content: "", author: "" });
  };

  // input kenttien muutokset
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      key={initialPost?._id}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialPost ? "Muokkaa postausta" : "Luo uusi postaus"}
      </h2>

      {/* Otsikko */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Otsikko
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kirjoita otsikko..."
        />
      </div>

      {/* Sisältö */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Sisältö
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kirjoita sisältö..."
        />
      </div>

      {/* Tekijä */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Tekijä</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kirjoita nimesi..."
        />
      </div>

      {/* Lähetä-nappi */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
      >
        {isLoading
          ? "Lähetetään..."
          : initialPost
            ? "Päivitä postaus"
            : "Luo postaus"}
      </button>
    </form>
  );
}
