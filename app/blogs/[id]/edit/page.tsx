import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/db";
import BlogForm from "../../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlog(params.id);
  if (!blog) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link href={`/blogs/${blog.id}`} className="btn-outline mb-10 inline-flex">
        ← Back to Post
      </Link>
      <p className="eyebrow mb-4">Edit Post</p>
      <h1 className="section-title mb-2">Make Changes.</h1>
      <div className="section-underline mb-10" />
      <BlogForm mode="edit" initial={blog} />
    </div>
  );
}
