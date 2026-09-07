import Link from "next/link";
import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blogs" className="btn-outline mb-10 inline-flex">
        ← Back to Blog
      </Link>
      <p className="eyebrow mb-4">New Post</p>
      <h1 className="section-title mb-2">Write Something.</h1>
      <div className="section-underline mb-10" />
      <BlogForm mode="create" />
    </div>
  );
}
