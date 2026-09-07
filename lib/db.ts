import fs from "fs/promises";
import path from "path";
import { Blog } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");
const BLOB_PATHNAME = "blogs.json";
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Local dev writes to the JSON file on disk. On Vercel, the filesystem is
// read-only, so once a Blob store is attached we persist the same JSON
// file's contents to Vercel Blob storage instead.
async function readAll(): Promise<Blog[]> {
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    if (blobs.length === 0) {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const seed = JSON.parse(raw) as Blog[];
      await writeAll(seed);
      return seed;
    }
    // The blob URL is a CDN edge cache key, so overwriting the same
    // pathname can briefly serve a stale copy. A cache-busting query
    // param forces a fresh fetch instead of a cached hit.
    const res = await fetch(`${blobs[0].url}?ts=${Date.now()}`, {
      cache: "no-store",
    });
    return (await res.json()) as Blog[];
  }
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Blog[];
}

async function writeAll(blogs: Blog[]): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(blogs, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(blogs, null, 2), "utf-8");
}

export async function getBlogs(): Promise<Blog[]> {
  const blogs = await readAll();
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBlog(id: string): Promise<Blog | undefined> {
  const blogs = await readAll();
  return blogs.find((b) => b.id === id);
}

export async function createBlog(
  input: Pick<Blog, "title" | "excerpt" | "content" | "author" | "category">
): Promise<Blog> {
  const blogs = await readAll();
  const now = new Date().toISOString();
  const blog: Blog = {
    id: Date.now().toString(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  blogs.push(blog);
  await writeAll(blogs);
  return blog;
}

export async function updateBlog(
  id: string,
  input: Partial<Pick<Blog, "title" | "excerpt" | "content" | "author" | "category">>
): Promise<Blog | undefined> {
  const blogs = await readAll();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  blogs[idx] = {
    ...blogs[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeAll(blogs);
  return blogs[idx];
}

export async function deleteBlog(id: string): Promise<boolean> {
  const blogs = await readAll();
  const next = blogs.filter((b) => b.id !== id);
  if (next.length === blogs.length) return false;
  await writeAll(next);
  return true;
}
