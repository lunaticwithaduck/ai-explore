# AI Explore

A Steam/Epic-style library for AI tools: browse, filter and compare tools, watch tutorials, follow updates, write reviews,
save tools into collections, and look at bundles. English and Bulgarian.

Next.js 16 on Firebase (Auth + Firestore). There are no Cloud Functions: `firebase/firestore.rules` is the backend.
Not deployed yet; it runs against the Firebase emulators (`demo-ai-explore`).

## Setup

Needs Node 22+, pnpm 11 and Java 21 (for the Firestore emulator).

```sh
pnpm install
pnpm dev        # Auth + Firestore emulators, seed data, next dev on http://localhost:3000
```

| Login (emulator only) | Email | Password |
|---|---|---|
| admin (`/admin`) | `admin@ai-explore.test` | `admin-pass-123` |
| member | `member@ai-explore.test` | `member-pass-123` |

## Layout

| dir | what |
|---|---|
| `app/` | Next.js App Router app (`[locale]` routes, next-intl, RTK Query over Firestore) |
| `packages/schemas/` | zod schemas shared by the app, seed and rules tests |
| `packages/ui/` | design tokens and Radix-based primitives |
| `firebase/` | security rules, indexes, rules tests, seed data |
| `scripts/` | emulators, seed, dev and the quality gate |
| `prompt/` | spec, plan, conventions and the overnight-run record |

## Checks

```sh
scripts/gate.sh --full   # biome, conventions, typecheck, unit, rules and e2e tests
pnpm test:rules          # Firestore rules only
pnpm test:e2e            # Playwright, 375 and 1280 widths
```

## Docs

- [prompt/SPEC.md](prompt/SPEC.md): product spec and the 26 invariants the tests enforce.
- [prompt/CLAUDE.md](prompt/CLAUDE.md): code conventions.
- [prompt/overnight/HANDOFF.md](prompt/overnight/HANDOFF.md): what the overnight build produced, open bugs and next steps
  to launch.
