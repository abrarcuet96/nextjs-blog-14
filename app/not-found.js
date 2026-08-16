import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-base-content/60">The page may have moved, or the article is not published.</p>
      <Link href="/" className="btn btn-primary mt-6">Return home</Link>
    </section>
  );
}
