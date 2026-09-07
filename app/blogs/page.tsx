import Link from "next/link";
import { getBlogs } from "@/lib/db";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div>
          <p className="eyebrow mb-4">All Posts</p>
          <h1 className="section-title">The Blog.</h1>
          <div className="section-underline" />
        </div>
        <Link href="/blogs/new" className="btn-solid w-fit">
          + New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="text-muted">No posts yet. Be the first to write one.</p>
      ) : (
        <div className="grid gap-px bg-line md:grid-cols-2">
          {blogs.map((blog) => (
            <div key={blog.id} className="card p-8 flex flex-col">
              <p className="eyebrow">{blog.category}</p>
              <Link href={`/blogs/${blog.id}`}>
                <h2 className="mt-4 text-2xl font-bold leading-snug hover:text-accent-light transition-colors">
                  {blog.title}
                </h2>
              </Link>
              <p className="mt-3 text-sm text-muted flex-1">{blog.excerpt}</p>
              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest2 text-white/40">
                <span>
                  {blog.author} ·{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-6 text-xs font-bold uppercase tracking-widest2">
                <Link href={`/blogs/${blog.id}`} className="text-accent-light hover:text-white transition-colors">
                  Read
                </Link>
                <Link href={`/blogs/${blog.id}/edit`} className="text-white/60 hover:text-white transition-colors">
                  Edit
                </Link>
                <DeleteButton id={blog.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
