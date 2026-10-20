**Template:** brief-v1 · **Task:** H2 · **Phase:** 6 (pulled forward) · **Model:** sonnet · **Base sha:** eae4f28

# H2 — SEO: metadata, hreflang, sitemap, robots, JSON-LD

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding where it applies.

## Scope
- `app/src/lib/seo/**`, `app/src/app/sitemap.ts`, `app/src/app/robots.ts`;
- `app/src/messages/{en,bg}/seo.json`;
- in `app/src/app/[locale]/**/page.tsx` and `layout.tsx`: **only** adding `generateMetadata` / `metadata` exports;
- `app/src/features/tool/detail/ToolDetailView.tsx`: **only** adding one `<ToolJsonLd tool={tool} />` line and its import;
- `artifacts/screens/H2-*` if useful.

## Goal (SPEC §3 SEO)
- **Metadata on every public page**, localized from `seo` messages:
  - the root locale layout sets the title template `%s · AI Explore`, a default description and `metadataBase` from `env.NEXT_PUBLIC_SITE_URL`;
  - pages: library; tool (title = tool name; description = localized tagline; OG image = the tool logo as an absolute URL); bundles list; bundle (name and description); compare (both tool names when present);
  - `alternates` gives a canonical URL plus `languages` for `en` (unprefixed) and `bg` (`/bg/…`), matching `localePrefix: 'as-needed'`.
  - Put the helpers in `lib/seo/` (e.g. `alternatesFor(path, locale)`) with unit tests.
- **noindex** (`robots: { index: false }`) on signed-in, auth and admin pages, and on the `(dev)` primitives page.
- **`sitemap.ts`:**
  - lists the library, bundles, compare, every published tool and every published bundle, each with en and bg alternates;
  - is `dynamic = 'force-dynamic'`, because builds have no emulator;
  - if catalogue reads fail, falls back to the static routes only and never throws.
- **`robots.ts`:** allow `/`; disallow `/admin`, `/library`, `/profile`, `/settings` and `/ui` (and their `/bg` forms); link the sitemap.
- **JSON-LD:**
  - `lib/seo/ToolJsonLd.tsx` renders `<script type="application/ld+json">` with a `SoftwareApplication` (name, description, applicationCategory, url, offers from `fromPriceCents` / free, and `aggregateRating` **only** when `rating.count > 0`);
  - serialise safely by escaping `<` in the JSON;
  - unit-test the generated object.

## Acceptance
- [ ] Unit tests: alternates and canonical for both locales, sitemap fallback on a reader error, and the JSON-LD object (with and without reviews).
- [ ] Inside the emulators, after a build, `curl` the library, `/bg`, `/tools/midjourney`, `/sitemap.xml` and `/robots.txt` from `next start`, and check the `<title>`, `hreflang` links and JSON-LD by eye. Record the output excerpts in the hand-back.
- [ ] `scripts/gate.sh --full --task H2 --base eae4f28 --expect-pending 20-25` → `GATE PASS`.
