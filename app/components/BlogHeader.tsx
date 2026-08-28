import Link from "next/link";

export default function BlogHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-8 sm:px-16">
      <Link
        href="/"
        className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold tracking-tight text-ink"
      >
        THIRAJ
      </Link>
      <Link
        href="/"
        className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        ← Back to portfolio
      </Link>
    </header>
  );
}
