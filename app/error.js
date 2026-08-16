"use client";

export default function GlobalError({ reset }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-error">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold">We could not show this page</h1>
      <p className="mt-3 text-base-content/60">The problem may be temporary. Please try the request again.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-6">Try again</button>
    </section>
  );
}
