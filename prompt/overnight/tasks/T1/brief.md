**Template:** brief-v1 · **Task:** T1 · **Phase:** 4 · **Model:** sonnet · **Base sha:** 4fb6e23

# T1 — Tool page

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/tool/**`, `app/src/messages/{en,bg}/tool.json`, `artifacts/screens/T1-*`.
Stub you replace: `features/tool/detail/ToolDetailView.tsx` (`{ tool, category, updates, similar, complementary }`).

## Owns
No INV of its own. INV-19's tool-page steps (tutorials carousel, compare link, share) must work on your page. E4 un-fixmes it.

## Goal (SPEC §3 order, rulings 2, 5, 9, 11)

### Header (`tool.header`)
- `ToolLogo` large, the name as `h1`, developer, a category badge, and the tagline.
- A **static** `StarRating` plus the average. Do **not** use `tool.ratingAverage` or `tool.ratingCount` here:
  those belong to V1's live summary inside ReviewsSection and must appear once per page.
- An actions row:
  - **Open** (`tool.openButton`): `Button asChild` around the next-intl `Link`, with
    `href={tool.websiteUrl} target="_blank" rel="noopener noreferrer"`. The label is "Open", aligned
    right on desktop.
  - The slots `SaveToolButton({ toolId })` and `AddToCollectionMenu({ toolId })` (U1).
  - `ShareButton({ url: env.NEXT_PUBLIC_SITE_URL + routes.tool(slug), title })` (T2).
  - `CompareLink({ toolId, otherToolId: similar[0]?.id })` (T2).

### Sections
- **About:** description and a feature list.
- **Plans** (`tool.plans`):
  - badges for free plan and trial days;
  - plan cards with price via `formatCents` plus period copy;
  - "Contact sales" for custom pricing;
  - a highlighted popular plan;
  - features as `Localized` strings.
- **Tutorials** (`tool.tutorials`):
  - the `Carousel` primitive, with its prev and next buttons carrying `carousel.previous` and `carousel.next`;
  - items are `tool.tutorialItem` with `data-id=<youtubeId>`;
  - each item shows a thumbnail `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (`Image`), the title, the
    duration and a difficulty badge;
  - click-to-load: an `iframe` from `https://www.youtube-nocookie.com/embed/<id>?autoplay=1` replaces the
    thumbnail (ruling 9).
- **Updates** (`tool.updates`):
  - a timeline with a kind badge, date, title and changes;
  - the version via `formatVersion` in `tool.updateVersion` (ruling 5: the bare number).
- **Reviews:** `ReviewsSection({ toolId })` from `@/features/reviews/components/ReviewsSection/ReviewsSection` (V1).
- **Similar tools** (`tool.similar`): a horizontal `Carousel` of `ToolCard` from `@/features/catalogue/components/ToolCard/ToolCard`.
- **Works well with** (`tool.complementary`): the complementary tools, framed as a workflow. Hide the
  section when the list is empty.

Look at `reference/figma-make/src/app/components/{ToolDetail,TutorialsSection,UpdatesSection,PricingSection,SimilarTools,ComplementaryTools}.tsx`.

## Acceptance
- [ ] Unit tests: the plan price label (free, monthly, yearly, custom) and the tutorial click-to-load.
- [ ] `scripts/gate.sh --full --task T1 --base 4fb6e23 --expect-pending 1-12,18-26` → `GATE PASS`.
- [ ] Screenshots: `/tools/midjourney` at 375 and 1280.
