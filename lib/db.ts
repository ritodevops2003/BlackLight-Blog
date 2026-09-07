import fs from "fs/promises";
import path from "path";
import { Blog } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");
const BLOB_PREFIX = "blogs-";
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Local dev writes to the JSON file on disk. On Vercel, the filesystem is
// read-only, so once a Blob store is attached we persist the same JSON
// file's contents to Vercel Blob storage instead.
//
// Vercel Blob caches each URL for a month minimum, so overwriting one
// fixed pathname can never be read back fresh. Instead, every write goes
// to a brand-new, never-before-cached pathname (guaranteed cache miss),
// and old versions are deleted right after.
async function readAll(): Promise<Blog[]> {
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    if (blobs.length === 0) {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const seed = JSON.parse(raw) as Blog[];
      await writeAll(seed);
      return seed;
    }
    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt).getTime() > new Date(b.uploadedAt).getTime() ? a : b
    );
    const res = await fetch(latest.url, { cache: "no-store" });
    return (await res.json()) as Blog[];
  }
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Blog[];
}

async function writeAll(blogs: Blog[]): Promise<void> {
  if (useBlob) {
    const { put, list, del } = await import("@vercel/blob");
    const pathname = `${BLOB_PREFIX}${Date.now()}.json`;
    await put(pathname, JSON.stringify(blogs, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    const { blobs: existing } = await list({ prefix: BLOB_PREFIX });
    const stale = existing
      .filter((b) => b.pathname !== pathname)
      .map((b) => b.url);
    if (stale.length > 0) {
      await del(stale);
    }
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
  // Right after a create/edit, Vercel Blob's storage can take a brief
  // moment to become consistent, so a read immediately after a write
  // (e.g. redirecting to the new post) can momentarily miss it. Retry
  // a few times before concluding the post really doesn't exist.
  const attempts = useBlob ? 5 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const blogs = await readAll();
    const found = blogs.find((b) => b.id === id);
    if (found) return found;
    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
  return undefined;
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
