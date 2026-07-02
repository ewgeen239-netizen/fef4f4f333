# /public/images

Drop production assets here and swap the demo Unsplash URLs in
`lib/portfolio.ts` + hero/CTA `src` for local paths (e.g. `/images/work-01.jpg`).

Required:
- `og.jpg` — 1200×630 OpenGraph card (referenced in `app/[lang]/layout.tsx`)
- `favicon.ico` / `icon.png` — place `icon.png` (or `apple-icon.png`) in `/app`
- portfolio images — 900×1200 (3:4) recommended, ~70–80 quality

For real blur placeholders, generate base64 with `plaiceholder` at build
time and set `blurDataURL` per `Work` in `lib/portfolio.ts`.
