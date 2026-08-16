export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} NextBlog</p>
        <p>Built with Next.js, MongoDB, and curiosity.</p>
      </div>
    </footer>
  );
}
