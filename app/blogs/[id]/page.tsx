import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/db";
import DeleteButton from "../DeleteButton";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlog(params.id);
  if (!blog) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blogs" className="btn-outline mb-10 inline-flex">
        ← Back to Blog
      </Link>

      <p className="eyebrow">{blog.category}</p>
      <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
        {blog.title}
      </h1>
      <div className="mt-6 flex items-center justify-between border-y border-line py-4 text-xs uppercase tracking-widest2 text-white/40">
        <span>
          {blog.author} ·{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-6 font-bold">
          <Link href={`/blogs/${blog.id}/edit`} className="text-white/60 hover:text-white transition-colors">
            Edit
          </Link>
          <DeleteButton id={blog.id} />
        </span>
      </div>

      <div className="mt-10 space-y-6 text-white/80 leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>
    </article>
  );
}
