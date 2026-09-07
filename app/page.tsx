import Link from "next/link";
import { getBlogs } from "@/lib/db";

export default async function HomePage() {
  const blogs = await getBlogs();
  const latest = blogs.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,76,245,0.25),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-28">
          <p className="eyebrow mb-6">Blacklight Blog</p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase leading-[1.05] tracking-tight max-w-3xl">
            The future of marketing is here,{" "}
            <span className="text-accent-light">nice to meet you.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted text-sm md:text-base">
            Ideas on strategy, AI, and creative production from the team at
            Blacklight Group — written fast, read faster.
          </p>
          <Link href="/blogs" className="btn-outline mt-8">
            Read the Blog →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 md:grid-cols-2 items-start">
          <div>
            <h2 className="section-title">Reach Further.</h2>
            <div className="section-underline" />
            <p className="mt-6 text-muted text-sm leading-relaxed max-w-md">
              We write what we practice: creative work backed by real data,
              AI-assisted production, and campaigns built to move fast. This
              blog is where we share it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Stat label="Posts Published" value={String(blogs.length)} suffix="" />
            <Stat label="Avg. Read Time" value="4" suffix="MIN" />
            <Stat label="Categories" value="3+" suffix="" />
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white/20">
                Latest Posts
              </h2>
            </div>
            <Link href="/blogs" className="btn-outline hidden md:inline-flex">
              View All
            </Link>
          </div>
          <div className="grid gap-px bg-line md:grid-cols-3">
            {latest.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="card p-8 hover:bg-panel/60 transition-colors group"
              >
                <p className="eyebrow">{blog.category}</p>
                <h3 className="mt-4 text-xl font-bold leading-snug group-hover:text-accent-light transition-colors">
                  {blog.title}
                </h3>
                <p className="mt-3 text-sm text-muted line-clamp-3">
                  {blog.excerpt}
                </p>
                <p className="mt-6 text-xs uppercase tracking-widest2 text-white/40">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
          <Link href="/blogs" className="btn-outline mt-10 md:hidden">
            View All
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent-gradient">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight max-w-xl">
            Engage your audience.
          </h2>
          <p className="mt-4 text-white/70 max-w-md text-sm">
            Have something to say? Publish a new post in seconds.
          </p>
          <Link href="/blogs/new" className="btn-outline mt-8 border-white text-white hover:text-white/70">
            Write a Post →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest2 text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold">
        <span className="text-accent-light">{value}</span>{" "}
        <span className="text-base text-muted">{suffix}</span>
      </p>
    </div>
  );
}
