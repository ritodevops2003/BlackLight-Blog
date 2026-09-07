import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="section-title">Page Not Found.</h1>
      <div className="section-underline mx-auto mb-8" />
      <Link href="/" className="btn-outline">
        ← Back Home
      </Link>
    </div>
  );
}
