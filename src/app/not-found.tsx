import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">404</p>
        <h1 className="display-xl mt-4 text-6xl">Scene not found.</h1>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-bg"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
