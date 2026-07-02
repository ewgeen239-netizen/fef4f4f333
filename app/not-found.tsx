import Link from "next/link";

// Root-level 404 (outside locale tree).
export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="font-serif text-display text-brass">404</p>
      <p className="text-bone-dim">Page not found · Nie znaleziono strony · Страница не найдена · Сторінку не знайдено</p>
      <Link
        href="/en"
        className="rounded-full border border-brass/40 px-8 py-4 text-xs uppercase tracking-editorial transition-colors hover:bg-brass hover:text-ink"
      >
        Krasnovska PH
      </Link>
    </div>
  );
}
