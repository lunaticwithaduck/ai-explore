# Plan

## §0 — Decisions (closed 2026-10-20)

All decisions are closed and written into `CLAUDE.md`. Workers code against them without
re-litigating them.

| # | Decision | Closed as |
|---|---|---|
| 1 | Framework | Next.js 16 App Router on **Firebase App Hosting** (owner) |
| 2 | Backend | Firebase Auth + Firestore, **no Cloud Functions**, security rules as the backend (owner) |
| 3 | Payments | Bundle pricing, pages and data model; **no checkout**. Subscribe sits behind `checkoutEnabled` (off); "Notify me" records interest (owner) |
| 4 | Languages | `en` default + `bg`, next-intl, prefix `as-needed` (owner) |
| 5 | Repo | pnpm + Turborepo, fakturcho root tooling, majstorbg app layering |
| 6 | Data layer | RTK Query over Firestore, `fakeBaseQuery` + `queryFn`; RSC readers on `firestore/lite` |
| 7 | Search | Client-side over the full published catalogue; no search service |
| 8 | Notifications | Derived from the `updates` collection group; no fan-out writes |
| 9 | Admin | `admins/{uid}` existence, created by hand or by the seed script; never from the app |
| 10 | Logos | Static files under `app/public/logos/`; Storage uploads are [LATER] |
| 11 | Environments | Emulators with project `demo-ai-explore` only. No real Firebase project until the owner creates one |

**Billing note for the owner.** App Hosting runs on Cloud Run and needs the Blaze
(pay-as-you-go) plan, even without Functions. Decision 2 keeps the architecture
rules-only. It does not keep the project on Spark. A Spark-only alternative is a static
export on Firebase Hosting, which costs server rendering and the SEO in SPEC §3.

### Dependency allow-list

Installed in Phase 1 at the latest stable versions, pinned exactly, with versions recorded
in the ledger. Nothing outside this list is added without the owner.

- **app runtime:** `next react react-dom next-intl firebase @reduxjs/toolkit react-redux
  react-hook-form @hookform/resolvers zod class-variance-authority clsx tailwind-merge
  lucide-react motion embla-carousel-react`, plus these Radix packages:
  `@radix-ui/react-{slot,dialog,dropdown-menu,popover,select,tabs,tooltip,switch,toast,avatar,scroll-area,separator,label,checkbox,toggle-group,visually-hidden}`
- **dev:** `typescript @types/node @types/react @types/react-dom @biomejs/biome turbo husky
  vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
  @testing-library/user-event @playwright/test @axe-core/playwright firebase-tools
  @firebase/rules-unit-testing firebase-admin tsx tailwindcss @tailwindcss/postcss`

### Risks the plan carries

| Risk | Handling |
|---|---|
| App Hosting with a pnpm monorepo and Next 16 | H3 checks the current App Hosting docs and writes the setup into `DEPLOY.md`. The fallback (Hosting static export, or Cloud Run with a Dockerfile) is documented, not built |
| Rules for paired aggregate writes are subtle | R1 runs on Opus with a verifier. INV-7 exercises concurrent `increment()` batches |
| Parallel emulators collide on ports | Port slots: every worktree has `SLOT` 1–4 and trunk is 0. All ports derive from it (`scripts/slot.sh`) |
| Fabricated content | YouTube IDs are checked with oEmbed. Prototype prices are mock and stay `sample`, flagged in `firebase/seed/README.md`; real figures are a follow-up for the owner |
| Mac sleeps, usage limits, classifier blocks | See LOOP.md §Preflight: caffeinate, a heartbeat, and the owner staying for Phase 1 |

---

## Phases

Each phase ends at a gate: `scripts/gate.sh --full` green on trunk, the phase's
invariants green, and the manager has read the diff. No gate, no next phase.

Times are offsets from the start (T). When a phase overruns its box by more than 20
minutes, its unstarted P2 tasks go to `follow-ups.md` and the next phase opens.

### Phase 1 — Foundation (manager + 1 worker, owner present) · T+0:00–0:45 · P1

- **F1** Workspace: pnpm, turbo, fakturcho `biome.json` and `tsconfig.base.json`,
  `.nvmrc`, `.gitattributes`, husky, the full dependency install. Exclude
  `reference/**` from Biome, TypeScript and the conventions linter.
- **F2** `app/` skeleton:
  - Next 16 with `[locale]` routing and `proxy.ts`;
  - next-intl with namespaced catalogues;
  - `packages/ui` skeleton with a placeholder `tokens.css` wired into Tailwind 4;
  - zod env.
- **F3** Firebase:
  - `firebase.json` and `.firebaserc` (`demo-ai-explore`);
  - `scripts/slot.sh` port slots;
  - root scripts `emulators`, `seed`, `dev` (emulators + seed + next dev) and `test:rules`, `test:e2e`;
  - deny-all `firestore.rules` with one smoke test;
  - emulator and Playwright browser downloads.
- **L1** (Sonnet worker, in parallel after F1; scope `scripts/lint-conventions.cjs`,
  `scripts/gate.sh`, `scripts/lint-conventions.test.cjs`):
  - Port the AST rules from `../majstorbg-estate/frontend/apps/web/scripts/lint-conventions.cjs`:
    R1, R3, R4, R5, R7, R8 and the R12 layering.
  - Add fakturcho T5 (200 lines) and a "no JSX text literals" rule, with the `ToolLogo` allow-list.
  - Write `scripts/gate.sh` (§Gate script).
  - Each rule gets a fixture test.
- **F4** Husky `pre-commit`, then `gate.sh --full` green on the skeleton.

**Gate:** `gate.sh --full` is green on the skeleton, and `/` and `/bg` render in the e2e smoke.

### Phase 2 — Contracts (manager + 2 oracle workers) · T+0:45–1:30 · P1

- **C1** (manager, first) `packages/schemas`: every SPEC §2 document as a zod schema plus its
  inferred type, `Localized`, and `pricing.ts` with INV-13.
- **C2** (manager, after C1) App contracts:
  - `config/{routes,feature-flags,env,test-ids}.ts`;
  - `lib/firebase/*` (init, emulator wiring, converters);
  - `api/firestoreApi.ts`, `api/errors.ts`;
  - every `api/server/*` RSC reader (catalogue, tool, updates, bundles, categories, config);
  - `lib/format/{money,rating,version}.ts` with INV-16 and INV-17;
  - every route's `page.tsx` rendering a stub `<Area>View`;
  - every cross-lane **slot** as a stub component in its owner's folder (table below);
  - empty message namespaces in both locales, plus the parity test (INV-15).
  - `config/test-ids.ts` is the selector contract between the e2e oracle and the UI. Every
    element an INV spec touches has a constant there, and the owning lane must attach it.
- **O1** (Opus worker, after C1; scope `firebase/tests/**`, `firebase/seed/seed.test.ts`,
  `app/src/features/share/**/*.test.ts`): rules invariants INV-1–12 and unit oracles INV-14
  and INV-18.
- **O2** (Sonnet worker, after C2's `test-ids.ts` and `routes.ts`; scope `app/e2e/**`,
  `app/playwright.config.ts`): e2e specs INV-19–26 with emulator fixtures (seeded users,
  admin, sign-in helper). Selectors come only from `test-ids.ts`, roles and routes.
- **C3** (manager) Read both oracles against SPEC §Invariants line by line, fix gaps through
  the same workers, then freeze. Every oracle test is complete, tagged `INV-n` and marked
  `fixme`/`todo`. The gate counts pending invariants.

**Gate:** green except pending invariants. Pending = exactly {1–12, 14, 18–26}. Contracts and
oracle frozen.

**Cross-lane slots** (stubs created in C2, filled by the owner lane, composed by the consumer lane):

| Slot | Owner lane | Rendered by |
|---|---|---|
| `features/bundles/components/BundlesSection` | B2 | B1 library page |
| `features/my-library/components/SaveToolButton` | U1 | B1 card, T1 tool page |
| `features/my-library/components/AddToCollectionMenu` | U1 | T1 |
| `features/my-library/components/SidebarCollections` | U1 | A1 sidebar |
| `features/share/components/ShareButton` | T2 | T1 |
| `features/compare/components/CompareLink` | T2 | T1 |
| `features/reviews/components/ReviewsSection` | V1 | T1 |
| `features/notifications/components/NotificationsBell` | N1 | A1 header |
| `features/bundle-interest/components/NotifyMeButton` | M1 | B2 bundle page |

### Phase 3 — Backend and vocabulary (3 lanes) · T+1:30–2:45

| Task | Model | Lane (scope) | Owns | Pri |
|---|---|---|---|---|
| **R1** | Opus, verified | `firebase/firestore.rules`, `firebase/firestore.indexes.json` | INV-1–12. Composite indexes for every query in `api/` | P1 |
| **S1** | Sonnet | `firebase/seed/**` except `seed.test.ts`, `app/public/logos/**` | Port, from `reference/figma-make/src/app/data/` and `src/imports/`, the 8 prototype tools, 6 categories and 7 bundles (add Legal Research Stack). Fix internal inconsistencies so the headline price is the cheapest plan. ≥4 oEmbed-verified tutorials per tool, BG translations, `logo.background` per §9.2. `seed.ts` targets emulators only and also creates the e2e admin. INV-14 | P1 |
| **D1** | Opus | `packages/ui/**`, `app/src/app/[locale]/(dev)/**`, `app/messages/*/dev.json` | Tokens taken from the prototype's dark theme. Primitives: Button, IconButton, Input, SearchInput, Textarea, Select, Switch, Checkbox, Card, Badge, Tag, Avatar, Dialog, Sheet, DropdownMenu, Popover, Tabs, Tooltip, Toast, Skeleton, Carousel, Text, Heading, Link, Image, BackButton, StarRating. Plus a primitives page | P1 |

**Gate:** INV-1–14 green. The primitives page is screenshotted at 375 and 1280 and read by the manager.

### Phase 4 — Public product (4 lanes) · T+2:45–4:30

| Task | Model | Scope (plus its `api/endpoints/<domain>.ts` and `messages/*/<ns>.json`) | Owns | Pri |
|---|---|---|---|---|
| **A1** | Opus, verified | `app/src/shell/**`, `features/auth/**`, `app/[locale]/(auth)/**` | Header (search box → `/?q=`), sidebar (categories + `SidebarCollections` slot), locale switcher, user menu, mobile drawer. Firebase Auth email+password and Google, `authSlice`, `AuthGate`, `users/{uid}` creation on sign-up, locale persistence. INV-23 | P1 |
| **B1** | Sonnet | `features/library/**` | Library view: URL-state filters (§4), sort, tag/price filters, ToolCard (rulings 2–4), grid, empty states. INV-26 | P1 |
| **B2** | Sonnet | `features/bundles/**` | `BundlesSection`, bundle list and detail, period toggle, savings through `pricing.ts` | P1 |
| **T1** | Sonnet | `features/tool/**` | Tool page sections in SPEC §3 order: plans, tutorials carousel (ruling 9), updates (ruling 5), similar + complementary carousels (ruling 11), rating summary | P1 |
| **T2** | Sonnet | `features/compare/**`, `features/share/**` | Compare page and picker (§6), `CompareLink`, `ShareButton` (ruling 10). INV-18 | P1 (after a slot frees) |
| **E4** | Sonnet | `app/e2e/**` (removing `fixme` only), seams the manager names | INV-19 green end to end. Fix integration seams | P1 (after B1, T1, T2) |

**Gate:** INV-1–19, 23 and 26 green; `next build` green.

### Phase 5 — Signed-in product (4 lanes) · T+4:30–6:15

| Task | Model | Scope | Owns | Pri |
|---|---|---|---|---|
| **V1** | Opus, verified | `features/reviews/**` | ReviewsSection: list, sort, write, edit, delete through `reviewBatch.ts`, helpful votes | P1 |
| **U1** | Sonnet | `features/my-library/**` | Saved tools (realtime), collections CRUD, add-to-collection, `/library` view, `SidebarCollections` | P1 |
| **N1** | Sonnet | `features/notifications/**` | Bell, dropdown, derived feed (§5), New badge (ruling 6), mark all as read | P1 |
| **M1** | Sonnet | `features/admin/**`, `features/bundle-interest/**`, `app/[locale]/(admin)/**` | Admin CRUD for tools, bundles and updates, publish toggles, interest counts; NotifyMeButton. INV-22, INV-24 | P1 |
| **U2** | Sonnet | `features/account/**` | Profile and settings (§7, ruling 7), excluding delete | P1 |
| **U3** | Opus | `features/account/delete/**` | Delete account: own documents, reviews with decrements, then the auth user | P2 (after U2, V1) |
| **E5** | Sonnet | `app/e2e/**`, seams the manager names | INV-20 and INV-21 green end to end | P1 (after V1, U1, N1) |

**Gate:** INV-1–24 and 26 green.

### Phase 6 — Hardening · T+6:15–7:15

| Task | Model | Scope | Owns | Pri |
|---|---|---|---|---|
| **H1** | Sonnet | `features/**`, `shell/**`, `packages/ui/src/components/**` (fixes only) | INV-25 (axe). A 375 px pass on every route. Loading, empty and error states everywhere | P1 |
| **H2** | Sonnet | `lib/seo/**`, `app/sitemap.ts`, `app/robots.ts`, `generateMetadata` in route files | Metadata, hreflang, sitemap, JSON-LD (SPEC §3) | P2 |
| **H3** | Sonnet | `apphosting.yaml`, `DEPLOY.md`, `README.md`, `.env.example` | Deploy prep from current App Hosting docs. Covers indexes, rules deploy and admin bootstrap. **Never deploys** | P1 |
| **Q1** | Sonnet, read-only | `artifacts/qa/**` | Screenshots of every route at 375 and 1280, compared against the prototype, with findings as fix tasks | P2 |

**Gate:** all 26 invariants green; `gate.sh --full` green on trunk.

### Phase 7 — Wrap-up (manager) · T+7:15–8:00, hard stop at T+8:00

Final full gate, then `artifacts/screens/`, then `prompt/overnight/HANDOFF.md` (LOOP.md
§Handoff). Close the ledger. Send the owner a PushNotification.

---

## Gate script

`scripts/gate.sh [--quick | --full] [--task <id> --base <sha>]`. It writes `gates.log` with
every step's exit code and fails closed.

1. `biome check .`
2. `node scripts/lint-conventions.cjs`
3. `pnpm typecheck`
4. `pnpm test` (unit)
5. `--full` only: rules tests inside `firebase emulators:exec --only firestore,auth` on the slot's ports
6. `--full` only: `next build`, then e2e inside `emulators:exec` with seed → `next start` → Playwright
7. With `--task`: `git diff --name-only <base>..HEAD` ⊆ `prompt/overnight/tasks/<id>/scope.txt`
8. With `--task`: oracle check. No edits to `INV-` assertions or to `firebase/tests/**`, unless the task owns it.
9. Pending-invariant count is printed. At a phase gate it must equal the phase's expected set.

Workers run `--quick` while working. The manager runs `--task <id>` with `--full` on the
worker's head before merging.

---

## Worker brief template

The full template is `prompt/overnight/templates/brief.md`. Every brief contains:

```
You are working in worktree <path> on branch overnight/<id>, SLOT=<n>.
You may read anything in the repo. You may write only the paths in scope.txt. If you need
a change outside it, stop and say so in your hand-back.

Rules: prompt/CLAUDE.md (read it first; it is binding)
Spec: <the SPEC sections this task implements>
Acceptance: <the INV numbers this task owns, plus named checks with expected results>
Exemplar: <file:line to copy patterns from>
Out of scope: <list>
Stop conditions: <when to stop and hand back instead of guessing>

Write or unmark the tests first. You are done when `scripts/gate.sh --quick` is green
and your INV tests pass, not when you think you are done. No comments. No new dependencies.
Commit with named files. Then write handback.md.
```
