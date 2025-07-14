"use client";
import { FormEvent } from "react";

type PostFormProps = {
  onSubmit: (e: FormEvent) => void;
  value: string;
  setValue: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  loading: boolean;
};

export default function PostForm({
  onSubmit,
  value,
  setValue,
  name,
  setName,
  loading,
}: PostFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="投稿内容を入力..."
        className="w-full p-3 border rounded resize-none mb-2"
        rows={3}
      />
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
  );
}
