import { NextRequest, NextResponse } from "next/server";
import { createBlog, getBlogs } from "@/lib/db";

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, excerpt, content, author, category } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const blog = await createBlog({
    title,
    excerpt: excerpt || content.slice(0, 140),
    content,
    author: author || "Anonymous",
    category: category || "General",
  });

  return NextResponse.json(blog, { status: 201 });
}
