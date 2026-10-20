**Template:** brief-v1 · **Task:** D1 · **Phase:** 3 · **Model:** opus · **Base sha:** 376cd00

# D1 — Design tokens, primitives, and the primitives page

You define the visual vocabulary every feature lane will use. Feature lanes may only compose your
primitives. They cannot add raw HTML, colours, or arbitrary values, because the linter forbids it.
So completeness and clear APIs matter more than flourish.

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md`. It is binding. Read §Design tokens, §Components and §Code style.
2. `~/Repos/ai-explore/prompt/SPEC.md` §9 (design rulings 1–11 are binding) and §3 (which screens exist).
3. **Visual reference** (the owner's Figma Make prototype, read-only):
   - `reference/figma-make/src/styles/theme.css`
   - `reference/figma-make/src/app/components/{ToolCard,Header,Sidebar,ToolDetail,BundlesSection,Library}.tsx`
   It is a dark, Steam/Epic-style library with raised cards and per-tool logo tiles.
4. **House exemplars** (read-only):
   - `~/Repos/majstorbg-estate/frontend/packages/webui/src/components/Button/{Button.tsx,Button.styles.ts}` (cva + forwardRef + asChild);
   - `~/Repos/fakturcho/design/tokens/tokens.css` (semantic token naming).
5. What already exists: `packages/ui/src/{index.ts,lib/cn.ts,tokens/tokens.css,components/Heading,components/Text}`
   (placeholders; keep the `Heading` level/className and `Text` tone/size APIs working), and
   `app/src/app/globals.css`, which imports `tokens.css` and `@source`s `packages/ui/src`.

## Where you work
- Worktree `~/Repos/ai-explore-wt/D1`, branch `overnight/D1`, `SLOT=3`.
- Scope: see `scope.txt`. It covers `packages/ui/**`, the dev route `app/src/app/[locale]/(dev)/**`,
  `app/src/features/dev/**`, the `dev` message namespace, and `artifacts/screens/d1-*`.
- The hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/D1/handback.md`.

## Goal

### 1. `packages/ui/src/tokens/tokens.css`

This is the single source of truth: one Tailwind 4 `@theme` block.
- **Reset the default colours** (`--color-*: initial;`) so only semantic colours exist.
- **Semantic colours:**
  - surfaces: `surface`, `surface-raised`, `surface-sunken`, `surface-overlay`;
  - borders: `border`, `border-strong`;
  - text: `text`, `text-muted`, `text-subtle`, `text-inverse`;
  - accent: `accent`, `accent-hover`, `accent-subtle`, `accent-foreground`;
  - status: `success`, `warning`, `danger`;
  - focus and rating: `focus-ring`, `star`.
- **Accent palette:** one set per value of `ACCENTS` from `@ai-explore/schemas` (blue, violet, pink,
  amber, emerald, cyan, rose, slate). Each gets `--color-accent-<name>` and `--color-accent-<name>-subtle`.
  Collections and bundles colour themselves through these.
- **Also define** radii (including `card` and `button`), shadows, durations, the font stack (system
  stack only; no web-font download, because builds run offline), and `--container-content`. Keep
  Tailwind's spacing and type scale explicitly declared here.
- **Dark only for now.** Values sit under `@theme`. Structure the file so that a future
  `[data-theme=light]` block can override the same names.

### 2. Primitives

Each primitive is a folder `components/<Name>/<Name>.tsx` + `<Name>.styles.ts` (cva), with
`forwardRef` + `displayName` where it renders DOM, Radix-based where it has state or a11y semantics.
All are exported from `src/index.ts`.

| Primitive | Requirements |
|---|---|
| Button, IconButton | Variants primary/secondary/ghost/danger, sizes sm/md/lg, `asChild`, `iconLeft`/`iconRight` (LucideIcon). IconButton requires `label` (aria-label). Ruling 10: identical height in every state. |
| Input, SearchInput, Textarea | Ruling 8: high-contrast typed text, placeholder colour token, no heavy focus border, visible `focus-ring` |
| Select (Radix), Switch, Checkbox, Label | |
| Card | Variants raised/flat/interactive |
| Badge, Tag | Tag as a pressable chip with `aria-pressed` for filters |
| Avatar, Skeleton, Separator | |
| Dialog, Sheet | Sheet is a side drawer, for the mobile sidebar |
| DropdownMenu, Popover, Tabs, Tooltip | |
| Toast | Radix provider + viewport + item, driven by props |
| Carousel | embla, horizontal, scroll-snap feel. `previousLabel`/`nextLabel` props plus pass-through props for its two buttons, so the app can attach `data-testid`s. Buttons are disabled at the edges. |
| Heading, Text, TextLink | TextLink is `asChild`-capable, so the app wraps the next-intl `Link` |
| Image | Plain `img` with `loading="lazy"`, `decoding="async"`, and a required `alt` |
| StarRating | Display only: value 0–5 with halves |
| RatingInput | `role=radiogroup` of 5 options, each `role=radio` with `aria-checked` and `data-id="1".."5"`. Arrow-key support. Labels via props. |
| BackButton | Ruling 7: icon + label prop, `asChild` |
| ToolLogo | Ruling 2/3: a fixed-size tile per `size` variant (sm/md/lg). Background from the data-driven `background` prop through a `--logo-bg` custom property (this file is the linter's only R1 exception). The logo `src` is `object-contain`, never cropped, and the tile keeps an identical box whatever the image's aspect ratio. |

- **No copy inside primitives.** Every user-facing string, including aria-labels, is a prop. The app
  translates it.
- **Tests (vitest jsdom).** One test file per non-trivial primitive:
  - Button `asChild` renders the child element with button classes;
  - ToolLogo sets `--logo-bg` and has a constant box;
  - RatingInput supports arrow keys and `aria-checked`;
  - Carousel disables previous at the start;
  - SearchInput forwards its value.

### 3. Primitives page

The route is `app/src/app/[locale]/(dev)/ui/page.tsx`, which renders
`app/src/features/dev/primitives/PrimitivesView.tsx`.
- It shows every primitive and its variants.
- Copy comes from the `dev` namespace in both `en` and `bg`, with identical keys (INV-15 checks parity).
- It must pass `node scripts/lint-conventions.cjs`. Raw HTML only in `packages/ui`; in the app, compose primitives only.

### 4. Screenshots

Capture `artifacts/screens/d1-primitives-375.png` and `d1-primitives-1280.png` of `/ui`. One way:
1. `pnpm --filter @ai-explore/app build`.
2. Run the server and screenshot inside the slot's emulators:
   `scripts/emulators-exec.sh "cd app && (pnpm exec next start -p $APP_PORT &) && sleep 6 && pnpm exec playwright screenshot --full-page --viewport-size=375,812 http://127.0.0.1:$APP_PORT/ui ../artifacts/screens/d1-primitives-375.png && pnpm exec playwright screenshot --full-page --viewport-size=1280,900 http://127.0.0.1:$APP_PORT/ui ../artifacts/screens/d1-primitives-1280.png"`.
3. Make sure no stray `next start` stays running afterwards.

Look at the screenshots yourself and iterate until the page reads as a polished dark library UI.

## Acceptance
- [ ] `scripts/gate.sh --quick` → `GATE PASS`.
- [ ] `scripts/gate.sh --full --task D1 --base 376cd00` → `GATE PASS`.
- [ ] `grep -rE "#[0-9a-fA-F]{3,8}\b" packages/ui/src --include=*.ts --include=*.tsx` finds nothing. Hex
      values are allowed only in `tokens.css`.
- [ ] Both screenshots exist and you have viewed them. In the hand-back, describe the visual direction
      in about five lines (palette, radii, density).
- [ ] Every primitive in the table is exported from `@ai-explore/ui`.

## Out of scope
Feature components (ToolCard, headers, etc.), app layout and shell, fonts via `next/font`, and light theme values.

## Stop conditions (do not guess)
- A Radix package you need is not in `packages/ui/package.json`. Do not add it; use what is installed
  and flag the gap.
- A primitive cannot be built without raw values outside `tokens.css`.

## Boundaries
- No push, no deploy, no new dependencies, no comments. Named `git add` only.
- Commit as `feat(ui): design tokens and primitives [D1]` with a why-body and
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` into
`~/Repos/ai-explore/prompt/overnight/tasks/D1/handback.md`. Include a short "API cheat-sheet" section
listing each primitive's main props; the feature lanes will read it.
