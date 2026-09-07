"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Blog } from "@/lib/types";

interface Props {
  mode: "create" | "edit";
  initial?: Blog;
}

export default function BlogForm({ mode, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Image upload failed. Please try again.");
      return;
    }

    const { url } = await res.json();
    setImage(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    const payload = { title, category, author, excerpt, content, image };
    const res = await fetch(
      mode === "create" ? "/api/blogs" : `/api/blogs/${initial!.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    const saved = await res.json();
    router.push(`/blogs/${saved.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm text-red-400 border border-red-400/40 bg-red-400/10 px-4 py-3">
          {error}
        </p>
      )}

      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full px-4 py-3 text-sm"
        />
      </Field>

      <Field label="Featured Image">
        <div className="space-y-3">
          {image && (
            <div className="relative h-48 w-full overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-2 right-2 bg-ink/80 text-white text-xs font-bold uppercase tracking-widest2 px-3 py-1.5 hover:bg-red-500/80 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste an image URL…"
              className="flex-1 px-4 py-3 text-sm"
            />
            <label className="btn-outline cursor-pointer whitespace-nowrap justify-center">
              {uploading ? "Uploading…" : "Upload Image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Strategy"
            className="w-full px-4 py-3 text-sm"
          />
        </Field>
        <Field label="Author">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Blacklight Team"
            className="w-full px-4 py-3 text-sm"
          />
        </Field>
      </div>

      <Field label="Excerpt">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary (optional — auto-generated if left blank)"
          rows={2}
          className="w-full px-4 py-3 text-sm"
        />
      </Field>

      <Field label="Content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          rows={14}
          className="w-full px-4 py-3 text-sm"
        />
      </Field>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-solid disabled:opacity-50"
        >
          {loading ? "Saving…" : mode === "create" ? "Publish Post" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-2 text-xs font-bold uppercase tracking-widest2 text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
