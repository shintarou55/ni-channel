"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { error } from "console";
import toast from "react-hot-toast";

type Post = {
  id: number;
  content: string;
  created_at: string;
  name?: string; // ？は任意という意味。必須項目ではなく、あっても無くても良いやつという意味。
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editName, setEditName] = useState("");

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

    const { error } = await supabase.from("posts").insert({
      content: newPost,
      name: name.trim() || null,
    });

    if (error) {
      console.log("投稿エラー：", error);
      toast.error("投稿に失敗しました");
    } else {
      setNewPost("");
      setName("");
      fetchPosts();
      toast.success("投稿しました！");
    }

    setLoading(false);
  };

  const handleDeleta = async (id: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.log("削除エラー：", error);
      toast.error("削除に失敗しました");
    } else {
      fetchPosts();
      toast.success("削除しました！");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditContent(post.content);
    setEditName(post.name || "");
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ content: editContent, name: editName.trim() || null })
      .eq("id", editingId);

    if (error) {
      console.log("更新エラー：", error);
      toast.error("更新に失敗しました");
    } else {
      setEditingId(null);
      setEditContent("");
      setEditName("");
      fetchPosts();
      toast.success("更新しました！");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">掲示板アプリ</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="投稿内容を入力..."
            className="w-full p-3 border rounded resize-none mb-2"
            rows={3}
          ></textarea>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前（任意）"
            className="w-full p-2 border rounded mb-2"
          />
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
              {editingId === post.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border w-full mb-2"
                  ></textarea>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border w-full mb-2"
                    placeholder="投稿者名を入力"
                  />
                  <div>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded text-sm mr-2"
                    >
                      更新
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-300 text-white py-1 px-2 rounded text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{post.content}</p>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500 mt-2 flex gap-6">
                      <span>
                        {post.name ? `投稿者：${post.name}` : `投稿者；匿名`}
                      </span>
                      <span>
                        投稿日：{" "}
                        {new Date(post.created_at).toLocaleString("ja-JP")}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded text-sm mr-2"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleta(post.id)}
                        className="bg-red-500 hover:bg-red-300 text-white py-1 px-2 rounded text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
