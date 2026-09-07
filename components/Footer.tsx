import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-accent-gradient border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <Image
            src="/blacklight-logo.avif"
            alt="Blacklight"
            width={661}
            height={105}
            className="h-6 w-auto"
          />
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            The future of marketing is here. A simple blog, built to move fast
            and read clean.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest2 text-white/60 mb-3">
            Quick Links
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-accent-light transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-accent-light transition-colors">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/blogs/new" className="hover:text-accent-light transition-colors">
                Write a Post
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest2 text-white/60 mb-3">
            Contact
          </div>
          <p className="text-sm text-white/70">contact@blacklightgroup.com</p>
          <p className="text-sm text-white/70 mt-1">(123) 456-7890</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © 2026 Blacklight Group. All rights reserved.
      </div>
    </footer>
  );
}
