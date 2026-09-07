import fs from "fs/promises";
import path from "path";
import { Blog } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");

async function readAll(): Promise<Blog[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Blog[];
}

async function writeAll(blogs: Blog[]): Promise<void> {
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
