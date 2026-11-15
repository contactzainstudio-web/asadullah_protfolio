"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
      <div>
        <h1 className="display-xl text-5xl">Something went wrong.</h1>
        <p className="mt-4 text-muted">The page hit an unexpected error.</p>
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-bg"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
