import BlogList from "@/components/BlogList";

export default function Home() {
  return (
    <>
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="badge badge-primary badge-outline mb-5">
            Learn by sharing
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Simple ideas, clearly written.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">
            Read practical articles from our community or create an account and
            publish your own.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Latest articles
          </p>
          <h2 className="mt-1 text-3xl font-bold">Explore the blog</h2>
        </div>
        <BlogList />
      </section>
    </>
  );
}
