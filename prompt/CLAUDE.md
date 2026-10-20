# Rules

These hold for the whole repo, every phase, every worker. They are not advice.
Root tooling follows `../fakturcho`. App structure follows `../majstorbg-estate/frontend/apps/web`
(read-only references, never modified).

## Repo shape

```
app/                    @ai-explore/app      Next.js 16 — the product
packages/schemas/       @ai-explore/schemas  zod schema + type for every Firestore document; pricing math
packages/ui/            @ai-explore/ui       tokens + primitives (Radix + cva); owns raw HTML
firebase/               firestore.rules, firestore.indexes.json, tests/ (rules invariants), seed/
scripts/                lint-conventions.cjs, gate.sh, emulator slot helpers
reference/figma-make/   the Figma Make prototype — read-only reference, never imported
prompt/                 rules, spec, plan, the overnight loop and its state
```

pnpm workspaces + Turborepo. Packages are source-only (no build step), consumed through
`transpilePackages`. Node 22 LTS (`.nvmrc`), `engines.node >=22`. TypeScript strict
everywhere with the fakturcho base: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.

## Stack

Closed 2026-10-20 (PLAN §0). Not open for renegotiation by a worker.

- Next.js 16 App Router, React 19, deployed on **Firebase App Hosting**.
- **Firebase Auth + Firestore. No Cloud Functions. No Admin SDK at runtime.** Security
  rules are the backend. `firebase-admin` exists only as a devDependency for the seed script.
- i18n: next-intl. Locales `en` (default) and `bg`, prefix `as-needed`, no locale detection.
- Server state: RTK Query over Firestore (`fakeBaseQuery` + `queryFn`, realtime through
  `onCacheEntryAdded`). Client state: Redux Toolkit slices. No Zustand, no Context-as-store.
- Forms: react-hook-form + zod + `@hookform/resolvers`.
- UI: Radix primitives + Tailwind 4 + cva `*.styles.ts` + `cn` (`twMerge(clsx())`). shadcn is
  a copy-source, never a dependency. Icons `lucide-react`. Motion `motion`. Carousels
  `embla-carousel-react`.
- Lint/format: Biome (fakturcho `biome.json` verbatim) + `scripts/lint-conventions.cjs`.
- Tests: Vitest (logic + jsdom components), `@firebase/rules-unit-testing` (rules),
  Playwright + `@axe-core/playwright` (e2e). All against the **Firebase emulators** only.
- Dependencies come from PLAN §0's list. A worker never adds one; it stops and reports.

## Firebase

- Project id is `demo-ai-explore` everywhere outside production config. `demo-` projects
  cannot reach real resources; nothing in this repo points at a real Firebase project.
- Every emulator run goes through `scripts/` helpers that apply the worktree's port
  **slot** (`SLOT` 0–4). Never hard-code emulator or dev-server ports.
- `firestore.rules` is the security boundary. A UI guard is UX, never security. Every
  rule change ships with rules tests in `firebase/tests/`.
- Rules are not filters: every public list query includes `where('published', '==', true)`.
- Reads go through converters that parse with `@ai-explore/schemas`. A document that fails
  to parse is logged and dropped, never rendered half-valid.
- Aggregates (`rating`, `helpfulCount`) change only in the same batched write as the
  document that justifies them, using `increment()`. One module per aggregate builds that
  batch (`features/reviews/utils/reviewBatch.ts`); nothing else writes those fields.
- Server components read public data with `firebase/firestore/lite`, unauthenticated, in
  `app/src/api/server/<domain>.ts` only, cached with tags + `revalidate`.
- Signed-in segments are guarded on the client by an `AuthGate` in the segment layout.
  This is a deliberate deviation from majstorbg R13 (there is no server session without
  the Admin SDK). Server session cookies are [LATER].

## App structure (majstorbg layering)

Layers, imports only point down: `app → shell → features → shared (api, lib, i18n) → config`.
The shell sits above features because it composes their slot components (`NotificationsBell`,
`SidebarCollections`). Features never import the shell.

```
app/src/
  app/[locale]/(public|auth|signed-in|admin)/…   route files only; page.tsx renders one <Area>View
  features/<domain>/<area>/<Area>View.tsx         'use client' when it uses hooks
  features/<domain>/components/<Name>/<Name>.tsx + <Name>.styles.ts
  features/<domain>/{hooks,utils,config}/
  shell/                                          header, sidebar, locale switcher, AuthGate
  api/firestoreApi.ts                             the one RTK Query api (manager-owned)
  api/endpoints/<domain>.ts                       injectEndpoints per domain, hooks exported here
  api/server/<domain>.ts                          RSC readers
  lib/firebase/                                   client + lite init, emulator wiring, converters
  i18n/                                           routing, navigation (Link, useRouter, redirect), request, namespaces
  config/{env,routes,feature-flags}.ts
  messages/{en,bg}/<namespace>.json               one namespace per feature
```

- `page.tsx` holds no `'use client'`, no hooks and no markup.
- Another feature may import only a domain's root `components | hooks | utils | config`.
- Hrefs come from `@/config/routes`. `Link`, `useRouter` and `redirect` come from the
  next-intl navigation wrapper only.
- Feature flags: typed defaults in `config/feature-flags.ts`, overridden by `config/app`,
  read on the server with React `cache()` and a 500 ms timeout falling back to defaults.
- Env: one zod schema in `config/env.ts` listing every `process.env.X` explicitly.

## Design tokens

- Every colour, spacing step, radius, font size, weight, line height, shadow and duration
  is defined once in `packages/ui/src/tokens/tokens.css` (Tailwind 4 `@theme`) and
  consumed by name.
- No raw literals in component code: no `#hex`, no `px` or `rem`, no arbitrary Tailwind
  values, no `style={}`. The only exception is `ToolLogo`, which sets the data-driven
  `--logo-bg` custom property from `tool.logo.background`. It is allow-listed by path in
  the linter.
- Dark theme only in the MVP. Tokens are semantic (`surface`, `surface-raised`, `text-muted`,
  `accent`, `danger`, `focus-ring`) so a light theme is a second value set, not a refactor.
- Adding a token is a deliberate act. A worker that needs one stops and reports.

## Components

```
packages/ui/src/components/Button/
  Button.tsx          markup + behaviour; forwardRef + displayName; asChild via Radix Slot
  Button.styles.ts    cva definition, no JSX
packages/ui/src/index.ts    the barrel
```

- `packages/ui` owns raw HTML. Feature code does not render raw `<button>`, `<input>`,
  `<a>`, `<img>`, `<h1>`–`<h6>`, `<p>` or `<label>`; it uses primitives.
- Copy goes through `useTranslations` / `getTranslations`. There is no literal text in
  JSX. Static option arrays and copy live in `features/<domain>/config/constants.ts`.
- One component per file. No file over 200 lines. Split before that.

## Code style

- No explanatory comments. A comment is allowed only where the code is genuinely
  non-obvious and a name cannot say it: a spec or invariant reference (`// INV-5`), or a
  workaround with a link.
- Named exports everywhere. Default exports only where Next requires them.
- `type` over `interface`. Props are `<Component>Props`. `import type` for types.
- Errors: Firestore errors map to typed codes in `api/errors.ts`, and the UI renders
  translated messages from that map. No raw error strings reach the screen.

## Money

- Integer minor units (cents, USD) in Firestore, schemas and code. Never a float.
- Formatting happens in exactly one module (`lib/format/money.ts`), locale-aware.
- Bundle list price and savings are computed only in `packages/schemas/src/pricing.ts`.

## Tests

- Every invariant in `SPEC.md §Invariants` has a test, tagged with its number
  (`INV-7`). Invariant tests are written before the implementation (Phase 2) and are the
  oracle. A worker may only take the `fixme` marker off its own invariants; it never
  edits their assertions.
- Rules tests live in `firebase/tests/` and run inside `emulators:exec`.
- Unit tests are colocated (`<module>.test.ts[x]`): jsdom, globals, Testing Library.
- E2E lives in `app/e2e/*.spec.ts`. Projects `mobile` (375 px) and `desktop` (1280 px). It runs
  against `next build && next start` plus the seeded emulators. Specs select only through
  `config/test-ids.ts`, roles and `config/routes.ts`. A lane that owns an element named in
  `test-ids.ts` attaches that id.

## Language

- UI copy in English and Bulgarian. `en` and `bg` catalogues have identical keys (INV-15).
- Code, identifiers, commits, comments and docs are English.

## Git

- Conventional commits: `type(scope): imperative subject`, a body that says why, and the
  attribution line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `git add` names files. Never `git add -A` or `git add .`. Never `--no-verify`. Never
  force-push, rebase shared branches or rewrite trunk history.
- Husky `pre-commit`: `pnpm lint && pnpm typecheck && pnpm test` (unit only; rules and e2e
  run in `scripts/gate.sh`).
