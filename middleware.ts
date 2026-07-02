import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function pickLocale(req: NextRequest): string {
  const header = req.headers.get("accept-language") ?? "";
  const wanted = header.split(",").map((p) => p.split(";")[0].trim().toLowerCase());
  for (const w of wanted) {
    const base = w.split("-")[0];
    // map uk -> ua
    const norm = base === "uk" ? "ua" : base;
    if ((locales as readonly string[]).includes(norm)) return norm;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/images/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
