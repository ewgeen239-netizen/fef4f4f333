// Single source of truth for session packages (price list).
// Structural, non-localized data lives here; translated strings (name,
// description, includes) live in messages/*.json under `services.packages[id]`.
// The Services page renders cards by iterating this array — no duplicated markup.

export type PackageId = "personal" | "love-family";

// Must match Prisma enum SessionType + the booking form select.
export type SessionType = "PERSONAL" | "LOVE_FAMILY";

export type Package = {
  id: PackageId;
  sessionType: SessionType;
  /** price per hour, shown large */
  price: string;
};

export const packages: Package[] = [
  { id: "personal", sessionType: "PERSONAL", price: "200 zł" },
  { id: "love-family", sessionType: "LOVE_FAMILY", price: "250 zł" },
];
