export default function Loading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading content">
      {[1, 2, 3].map((item) => <div key={item} className="skeleton h-64 rounded-2xl" />)}
    </div>
  );
}
