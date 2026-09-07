import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/blacklight-logo.avif"
            alt="Blacklight"
            width={661}
            height={105}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest2">
          <Link href="/" className="hover:text-accent-light transition-colors">
            Home
          </Link>
          <Link href="/blogs" className="hover:text-accent-light transition-colors">
            Blogs
          </Link>
          <Link
            href="/blogs/new"
            className="text-accent-light border-b-2 border-accent pb-1 hover:text-white transition-colors"
          >
            New Post
          </Link>
        </nav>
      </div>
    </header>
  );
}
