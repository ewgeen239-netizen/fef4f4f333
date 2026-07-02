// Resolve the canonical site origin for metadata / OG / sitemap.
// Priority: explicit env → Vercel production domain → current Vercel deploy →
// localhost. Ensures og:image is an absolute, fetchable URL in production even
// when NEXT_PUBLIC_SITE_URL isn't set manually.
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const deploy = process.env.VERCEL_URL;
  if (deploy) return `https://${deploy}`;

  return "http://localhost:3000";
}
