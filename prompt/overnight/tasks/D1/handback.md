# D1 hand-back · round 1

**Head sha:** 69bb047 · **Gate:** `scripts/gate.sh --quick` → exit 0 (`GATE PASS`); `scripts/gate.sh --full --task D1 --base 376cd00` → exit 0 (`GATE PASS`, with rules, e2e, scope and oracle all at exit 0)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| Quick gate | — | `scripts/gate.sh --quick` | 0 (GATE PASS) |
| Full gate, scope and oracle | `prompt/overnight/tasks/D1/gates.log` | `scripts/gate.sh --full --task D1 --base 376cd00` | 0 (GATE PASS) |
| One `@theme`, default colours reset | `packages/ui/src/tokens/tokens.css:1-2` | — | — |
| Semantic colours, focus-ring, star, accent palette ×8 (+`-subtle`) | `packages/ui/src/tokens/tokens.css:4-47` | — | — |
| Radii (incl. `button`, `card`), shadows, durations, system font, spacing, type scale, `--container-content` | `packages/ui/src/tokens/tokens.css:50-129` | — | — |
| No hex in ui code | — | `grep -rE "#[0-9a-fA-F]{3,8}\b" packages/ui/src --include='*.ts' --include='*.tsx'` | 1 (no matches) |
| Conventions linter (R1/R3/R4/R5/T5, with `style=` only in ToolLogo) | `packages/ui/src/components/ToolLogo/ToolLogo.tsx:19` | `node scripts/lint-conventions.cjs` | 0 (0 findings, 193 files) |
| Every table primitive exported | `packages/ui/src/index.ts` | export-name check script (31/31 present) | 0 |
| Button `asChild` keeps the button classes | `packages/ui/src/components/Button/Button.test.tsx` | `pnpm --filter @ai-explore/ui test` | 0 |
| ToolLogo sets `--logo-bg`, constant box | `packages/ui/src/components/ToolLogo/ToolLogo.test.tsx` | same | 0 |
| RatingInput arrows, Home/End, `aria-checked`, `data-id` | `packages/ui/src/components/RatingInput/RatingInput.test.tsx` | same | 0 |
| Carousel previous disabled at start, pass-through test ids | `packages/ui/src/components/Carousel/Carousel.test.tsx` | same | 0 |
| SearchInput forwards value, change, ref, clear | `packages/ui/src/components/SearchInput/SearchInput.test.tsx` | same | 0 |
| (extra) Tag `aria-pressed`, StarRating halves, SegmentedControl radios | `Tag.test.tsx`, `StarRating.test.tsx`, `SegmentedControl.test.tsx` | same | 0 (18 tests, 8 files) |
| `/ui` route + view | `app/src/app/[locale]/(dev)/ui/page.tsx`, `app/src/features/dev/primitives/PrimitivesView.tsx` | `pnpm --filter @ai-explore/app build` (`/en/ui` and `/bg/ui` prerendered) | 0 |
| `dev` namespace en/bg parity (INV-15) | `app/src/messages/{en,bg}/dev.json` (204 keys each) | `pnpm --filter @ai-explore/app test` (messages.test.ts) | 0 |
| Screenshots exist and were viewed | `artifacts/screens/d1-primitives-375.png`, `artifacts/screens/d1-primitives-1280.png` | Playwright capture after `next start` (server stopped afterwards) | 0 |
| axe on `/ui` (en, bg, dialog open) | — | `@axe-core/playwright` scratch run | 0 violations |

## Visual direction
- **Palette:** cool near-black neutrals with a faint blue tint (hue 265). The page is `surface` (L 0.165), cards are `surface-raised` (0.215), menus and dialogs are `surface-overlay` (0.245), and inputs are a darker `surface-sunken` well (0.135). Borders are hairlines (0.295), with `border-strong` (0.39) for hover.
- **Accent:** a light periwinkle (`oklch(0.72 0.15 268)`, from the hue of the prototype's indigo) with dark `accent-foreground` text, in the style of the Epic store. It works as a fill (7.5:1) and as link text on any surface (7.6:1). Status colours are light and use tinted `*-subtle` backgrounds. The danger button is red text on a tinted background and fills solid on hover.
- **Radii:** buttons and inputs use 10 px (`rounded-button`), cards 14 px (`rounded-card`), menus and popovers 12 px, dialogs 16 px. Chips, badges and switches are pills.
- **Depth:** raised cards have a 1 px inner top highlight plus a soft drop shadow. The interactive card lifts 2 px on hover and its shadow deepens. Overlays sit on a blurred scrim.
- **Density:** compact. Controls are `h-8/10/12` (sm/md/lg) and every button state keeps its height. Body text is 14 px, and section labels are 12 px uppercase tracked `text-subtle`. Focus is a soft 3 px halo (`focus-ring`, the accent at 60 %) and never changes a border (ruling 8).

## API cheat-sheet
All are imported from `@ai-explore/ui`. Every user-facing string is a prop. Every DOM primitive forwards `ref`, `className` and the rest of its props, including `data-testid` and `data-id`.

| Primitive | Main props |
|---|---|
| `Button` | `variant` primary\|secondary\|ghost\|danger · `size` sm\|md\|lg · `iconLeft`/`iconRight` (LucideIcon) · `loading` · `fullWidth` · `asChild` (icons still render inside the child, e.g. `<Button asChild iconRight={ExternalLink}><a …>Open</a></Button>`) |
| `IconButton` | `icon` (LucideIcon) · `label` (required, becomes aria-label) · `variant` (default ghost) · `size` · `shape` square\|circle · `asChild` |
| `Input` | native input props · `size` sm\|md\|lg · `invalid` (sets aria-invalid and a danger border) |
| `SearchInput` | Input props (`type=search`, so role searchbox) · `clearLabel` + `onClear` (the clear button shows when `value` is non-empty) · `wrapperClassName` |
| `Textarea` | native props · `size` · `invalid` · `rows` (default 4) |
| `Select` | `options: {value,label,disabled?,testId?}[]` · `value`/`defaultValue`/`onValueChange` · `placeholder` · `size` · `invalid` · `name` · `required` · `contentClassName`. Every option gets `data-id={value}`. The remaining props go on the trigger (aria-label, data-testid) |
| `SegmentedControl` | `options: {value,label,icon?,disabled?,testId?}[]` · `value` · `onValueChange` · `label` (aria-label) · `size` sm\|md · `fullWidth`. Renders role radiogroup/radio with `aria-checked` and `data-id={value}`, and cannot be deselected |
| `Switch` | Radix Switch props (`checked`, `onCheckedChange`, `id`) · `size` sm\|md |
| `Checkbox` | Radix Checkbox props (`checked` true\|false\|'indeterminate', `onCheckedChange`) |
| `Label` | `htmlFor` · `size` sm\|md · `tone` default\|muted |
| `Card` | `variant` raised\|flat\|interactive · `padding` none\|sm\|md\|lg · `asChild`. Interactive shows a focus ring when a nested `<a>` has focus-visible, which suits the stretched-link pattern |
| `Badge` | `tone` neutral\|accent\|solid\|success\|warning\|danger\|outline · `accent` (AccentName, overrides tone) · `icon` · `size` sm\|md |
| `Tag` | `pressed` + `onPressedChange` (sets aria-pressed only when `pressed` is defined) · `icon` · `count` · `size` sm\|md · `asChild` |
| `Avatar` | `src?` · `alt` (required) · `fallback` (initials) · `size` sm\|md\|lg\|xl |
| `Skeleton` | `shape` rect\|circle\|text\|card. Size it with className |
| `Separator` | `orientation` · `decorative` (default true) |
| `Dialog` | `title` · `description?` · `closeLabel` · `trigger?` (element) · `footer?` · `size` sm\|md\|lg · `open`/`defaultOpen`/`onOpenChange` · children = body. Use `DialogClose asChild` for cancel/confirm buttons. Other props go on the content (data-testid) |
| `Sheet` | Dialog props plus `side` left\|right · `hideTitle` (sr-only) · `header?` (extra header node). `SheetClose` closes it from inside |
| `DropdownMenu` | Compound: `DropdownMenu`, `DropdownMenuTrigger asChild`, `DropdownMenuContent` (`align` default end), `DropdownMenuItem` (`icon`, `tone` default\|danger, `asChild` for a `Link`), `DropdownMenuCheckboxItem` (`checked`, `onCheckedChange`, `icon`, `iconClassName`), `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup` |
| `Popover` | Compound: `Popover`, `PopoverTrigger asChild`, `PopoverContent` (`size` sm\|md\|lg, `align`, `side`), `PopoverClose`, `PopoverAnchor` |
| `Tabs` | `Tabs` (`variant` underline\|pill, `value`/`defaultValue`/`onValueChange`) › `TabsList` › `TabsTrigger` (`value`, `icon`) + `TabsContent` (`value`). Render a content panel for every trigger (axe aria-controls) |
| `Tooltip` | `content` · children = trigger element · `side`/`align` · `delayDuration`. Carries its own provider |
| `Toast` | Mount `ToastProvider label viewportLabel` once. It renders the viewport. `Toast`: `open` · `onOpenChange` · `title` · `description?` · `tone` neutral\|success\|danger · `closeLabel` · `action?: {label, altText, onClick}` · `duration?` |
| `Carousel` | children = slides · `previousLabel` · `nextLabel` · `previousButtonProps`/`nextButtonProps` (e.g. `{ 'data-testid': TEST_IDS.carousel.next }`) · `heading?` (left of the controls) · `slideSize` sm\|md\|lg\|full · `aria-label`. The buttons disable at the edges |
| `Heading` | `level` 1–6 · `size` xs\|sm\|md\|lg\|xl\|2xl\|3xl (visual override; the default comes from the level) |
| `Text` | `tone` default\|muted\|subtle\|accent\|success\|warning\|danger\|inherit · `size` xs\|sm\|md\|lg · `weight` · `clamp` 1\|2\|3 · `numeric` (tabular-nums) · `as` p\|span\|div |
| `TextLink` | `tone` accent\|default\|muted\|inherit · `underline` hover\|always\|none · `size` · `iconRight` · `asChild` (`<TextLink asChild><Link href={routes.x}>…</Link></TextLink>`) |
| `Image` | `src` · `alt` (required) · `fit` cover\|contain\|none · `radius` none\|md\|lg\|card\|full · lazy loading and async decoding by default |
| `StarRating` | `value` 0–5 (rounded to halves) · `label` (required, role=img) · `valueText?` (visible formatted number) · `size` sm\|md\|lg |
| `RatingInput` | `value` (number\|null) · `onChange(1..5)` · `label` · `getOptionLabel(n)` · `size` md\|lg · `disabled` · `invalid`. Radios carry `data-id="1".."5"` and `aria-checked`. Arrow keys and Home/End select |
| `BackButton` | `label` · `size` sm\|md · `asChild` (`<BackButton asChild label={t('back')}><Link href={routes.library} /></BackButton>`). The arrow icon and label are added inside the child |
| `ToolLogo` | `src` · `alt` · `background` (any CSS colour, e.g. `tool.logo.background`) · `size` sm(32px)\|md(48px)\|lg(80px) · `shape` rounded\|circle. Fixed box, the image uses object-contain, rest props go on the tile (e.g. `data-testid={TEST_IDS.library.cardLogo}`) |
| Accent helpers | `ACCENT_NAMES`, `type AccentName`, plus `accentTextClass`, `accentSubtleClass` (bg and text), `accentSolidClass`, `accentBorderClass`, each a `Record<AccentName, string>`. Always index these maps. Never build `bg-accent-${x}` strings, because Tailwind cannot see them |
| `cn` | `twMerge(clsx())`, extended so the custom radius, shadow, duration, ease, animate and container names merge correctly |

## Decisions I made that the brief didn't dictate
- **`@theme static`, not plain `@theme`.** It emits every token on `:root`. The animation and default-transition tokens reference the duration and ease tokens through `var()`, and a later `[data-theme=light]` block can override any name. It is still the file's single `@theme` block. `color-scheme: dark` and `::selection` sit in `@layer base` beside it.
- **Tokens added beyond the brief's list:**
  - `scrim` (dialog backdrop) and `success/warning/danger-subtle` (tinted badges and the danger button);
  - a `radius` scale, `shadow-card`, `shadow-card-hover` and `shadow-overlay`;
  - `ease-standard` and `ease-emphasized`;
  - `animate-{fade,pop,slide-*}-{in,out}` keyframes for Radix enter and exit. tailwindcss-animate is not installed.
  - Durations use Tailwind's `--transition-duration-*` key so that `duration-fast|base|slow` work as utilities.
- **A light accent with dark foreground text,** not white text on a deep indigo. The deep indigo would fail AA as link text, and a single `accent` now serves fill, text and focus.
- **Added `SegmentedControl`** (Radix ToggleGroup). The INV-22 oracle clicks `bundles.periodOption` + `[data-id=period]` and expects `aria-checked`. No primitive in the table produces radios, and lanes cannot write raw buttons.
- **RatingInput is built on Radix ToggleGroup (single).** That gives native `role=radio` and `aria-checked`. Biome's `useSemanticElements` rejects a hand-rolled `role="radio"` button, and a comment suppressing it would break the no-comments rule.
- **Select and SegmentedControl add `data-id={value}` to every option automatically.** INV-23 picks the locale option by `shell.localeOption` + `[data-id="bg"]`.
- **Presentational primitives carry no `'use client'`,** so server components can pass Lucide icon components to Button, Badge, Tag, BackButton and so on. Radix and stateful primitives are `'use client'`. The `/ui` build checks this: its server-rendered sections pass icons. Tag attaches `onClick` only when a handler is given, so it renders in a server component.
- **Compound Radix primitives are split one component per file** (lint R5). Dialog, Sheet, Select, Tooltip and Toast are props-driven, which is simpler for lanes.
- **ui does not depend on `@ai-explore/schemas`** (no new dependency). `AccentName` therefore duplicates `ACCENTS`. The unions are structurally identical, so `Accent` values pass straight in.
- **Popper `sideOffset={6}` stays a numeric literal.** It is Radix positioning behaviour, not styling.
- **Screenshot capture used a small Playwright script that scrolls before the full-page shot.** The CLI `playwright screenshot` captured lazy images blank. I ran `next start` without emulators because `/ui` is fully static. The script stops the server on exit, and nothing is left running.
- **The `/ui` route has `robots: noindex` and is not gated in production,** because the screenshots run against `next start`.

## Slots
- Filled: none. D1 owns no slot component.
- Consumed while still stubbed: `AppShell`, which is a passthrough. `PrimitivesView` renders its own `<main>`.

## Not done, and why
- Light theme values: out of scope by the brief. Only the structure is in place.
- No `Field` or `FormField` wrapper: it is not in the table. Lanes compose `Label` + `Input` + `<Text size="xs" tone="danger">`.
- No `Spinner` or `Icon` primitive: `Button loading` covers spinners, and lanes size Lucide icons with token classes (`size-4 text-text-muted`).

## For the manager
- **A1:** mount `ToastProvider` (with translated `label` and `viewportLabel`) once in the shell before any lane shows toasts. Use `Sheet side="left" hideTitle` for the mobile sidebar. The mobile menu trigger is `IconButton` with `data-testid={TEST_IDS.shell.mobileMenuButton}`.
- **B1 ToolCard:** use `ToolLogo size="lg" data-testid={TEST_IDS.library.cardLogo}` (fixed box, INV-26). Use `Card variant="interactive" className="flex h-full flex-col"` with the price row pushed down by `mt-auto`, plus a stretched `Link` so the nested save button stays valid HTML. Category and tag filters are `Tag pressed/onPressedChange data-id={id}`.
- **B2:** build the period toggle with `SegmentedControl` and `testId: TEST_IDS.bundles.periodOption`. Use `accentSubtleClass[bundle.accent]` for bundle colour.
- **T1:** use `Carousel` with `previousButtonProps`/`nextButtonProps` carrying the `TEST_IDS.carousel.*` ids, inside the `tool.tutorials` container. The section heading goes in `heading`.
- **V1:** use `RatingInput data-testid={TEST_IDS.reviews.ratingInput}` and `Dialog` with `DialogClose` for confirm-delete.
- **N1:** build the bell from `DropdownMenu` + `IconButton`. The "New" label is `<Badge tone="solid">`.
- **Shared seams:**
  - Settings and Profile both use `BackButton asChild` around the next-intl `Link` (ruling 7).
  - axe found zero violations on `/ui` (en, bg, dialog open), so primitive defaults should not trip INV-25.
- **Follow-up for `follow-ups.md`:** a dynamic accent class must come from the exported maps, never a template string.
- **Follow-up for `follow-ups.md`:** the trunk has moved past base 376cd00 (O1, O2, S1 merged). Rebasing or merging D1 onto it touches nothing outside D1's scope.
