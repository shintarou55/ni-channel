"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: number;
  content: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("posts").insert({ content: newPost });

    if (!error) {
      setNewPost("");
      fetchPosts();
    }

    setLoading(false);
  };

  const handleDeleta = async (id: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) fetchPosts();
  };

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">掲示板アプリ</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="東京内容を入力..."
            className="w-full p-3 border rounded resize-none"
            rows={3}
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            投稿
          </button>
        </form>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 border rounded shadow">
              <p>{post.content}</p>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 block mt-2">
                  投稿日： {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
                <button
                  onClick={() => handleDeleta(post.id)}
                  className="bg-red-500 hover:bg-red-300 text-white py-1 px-2 rounded text-sm"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
