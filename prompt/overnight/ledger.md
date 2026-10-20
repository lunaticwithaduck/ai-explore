# Overnight ledger

Design: `prompt/LOOP.md`. Every session re-reads it, this ledger, and the newest
hand-back or verdict before acting.

## Owner grant

Recorded 2026-10-21 00:05 EEST. It expires when this ledger closes or at 08:05, whichever comes first.

The owner replied with this, verbatim, to the presented plan, whose §10 said the kickoff activates the grant:
- "we wont host yet, let's go"

The manager takes this as the LOOP.md §1 grant, within the §2 boundaries, for this run only.

The run executes in the planning session, which is rooted at `~/Repos`. Because of that,
`ai-explore/.claude/settings.json` (deny list) and `/overnight-tick` do not load. The manager
applies the §2 boundaries by hand, and the heartbeat prompt points at the command file.

## Run clock

| mark | time (from `date`) |
|---|---|
| T (start) | 2026-10-21 00:05 EEST |
| T+7:15 stop picking | 07:20 |
| T+7:35 wrap-up | 07:40 |
| T+8:00 hard stop | 08:05 |

## Pinned versions (Phase 1)

| package | version |
|---|---|
| next | 16.4.2 |
| react / react-dom | 19.3.1 |
| next-intl | 4.14.9 |
| firebase | 13.0.0 |
| firebase-tools | 15.34.0 |
| @firebase/rules-unit-testing | 6.0.0 |
| firebase-admin (seed only) | 14.5.0 |
| @reduxjs/toolkit / react-redux | 2.13.0 / 9.3.0 |
| react-hook-form / @hookform/resolvers / zod | 7.90.0 / 6.0.0 / 4.6.7 |
| tailwindcss / @tailwindcss/postcss | 4.3.3 |
| typescript | 6.0.3 (7.0.2 skipped, see Decisions) |
| @biomejs/biome / turbo / husky | 2.5.15 / 2.11.10 / 9.1.7 |
| vitest / jsdom / @playwright/test / @axe-core/playwright | 5.0.5 / 30.1.3 / 1.64.1 / 4.14.0 |
| lucide-react / motion / embla-carousel-react | 1.60.0 / 14.4.0 / 8.6.0 |
| pnpm / node (local) | 11.21.0 / 24.19.0 (.nvmrc 22) |

## Worktrees

| id | path | branch | SLOT |
|---|---|---|---|
| trunk | ~/Repos/ai-explore | overnight/trunk | 0 |

## Tasks

Status values: `queued`, `working`, `gate`, `verifying`, `failed×n`, `escalated`, `parked`, `merged`, `held`, `deferred`.
A ✓ after the model means the task gets a verifier.

| id | phase | model | pri | title | depends on | INV | status | base | head | rounds | verdict | fail cause | LOC Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F1 | 1 | manager | P1 | Workspace, tooling, dependency install | — | — | merged |  | 94d5074 |  |  |  |  |
| F2 | 1 | manager | P1 | App skeleton: Next 16, `[locale]`, next-intl, Tailwind → ui tokens, env | F1 | — | merged |  | 716a73b |  |  |  |  |
| F3 | 1 | manager | P1 | Firebase emulators, port slots, deny-all rules and smoke test | F1 | — | merged |  | 716a73b |  |  |  |  |
| L1 | 1 | sonnet | P1 | lint-conventions port, gate.sh, fixture tests | F1 | — | merged | 94d5074 | 01950c5 | 1 | gate PASS (full, 20s) |  |  |
| F4 | 1 | manager | P1 | Husky, full gate green on the skeleton | F2 F3 L1 | — | merged |  | 01950c5 |  |  |  |  |
| C1 | 2 | manager | P1 | `packages/schemas` and `pricing.ts` | F4 | 13 | merged |  | f9b8a32 |  | INV-13 green (16 tests) |  |  |
| C2 | 2 | manager | P1 | App contracts: config, test-ids, firebase lib, api base, RSC readers, formatters, route stubs, slots, namespaces | C1 | 15 16 17 | merged |  | e38f821 |  | INV-15 16 17 green; gate --full PASS |  |  |
| O1 | 2 | opus | P1 | Oracle: rules INV-1–12, unit INV-14 and INV-18 (`fixme`) | C1 | — | merged | f9b8a32 | ef3c37c | 1 | 138 rules tests; mutation-checked; gate PASS |  | +2100 |
| O2 | 2 | sonnet | P1 | Oracle: e2e INV-19–26 and emulator fixtures (`fixme`) | C2 | — | merged | 0865ad6 | 73406e8 | 1 | C3-reviewed; gate --full PASS, pending 19–26 |  |  |
| C3 | 2 | manager | P1 | Review oracles against SPEC, freeze | O1 O2 | — | merged |  | ef3c37c |  | O2 fixes (networkidle, logo path), +review collection-group test, INV-14 unskipped (9/9 vs seed) |  |  |
| R1 | 3 | opus ✓ | P1 | Firestore rules and indexes | C3 | 1–12 | merged | ef3c37c | 80643ef | 1 | VERDICT PASS (verifier: 140/140 + 28 probes denied) |  |  |
| S1 | 3 | sonnet | P1 | Seed data, seed script, logos, e2e admin | C3 | 14 | merged | 376cd00 | 93a7b5b | 1 | gate --full PASS; INV-14 checks pre-verified (oracle test lands with O1) |  | +1763 |
| D1 | 3 | opus | P1 | Design tokens, primitives, primitives page | C3 | — | merged | 376cd00 | 4fb6e23 | 1 | gate --full PASS; screenshots reviewed (polished dark system, 32 primitives) |  |  |
| A1 | 4 | opus ✓ | P1 | Shell, auth, locale persistence | R1 D1 | 23 | working | 80643ef |  | 1 |  |  |  |
| B1 | 4 | sonnet | P1 | Library view, ToolCard, filters | S1 D1 | 26 | merged | 4fb6e23 | a8a9df3 | 1 | gate --full PASS; INV-26 green; 23 filter tests |  |  |
| B2 | 4 | sonnet | P1 | BundlesSection, bundle list and detail | S1 D1 | — | merged | 4fb6e23 | b208313 | 1 | gate --full PASS after ToolCard move; 4 unit tests |  |  |
| T1 | 4 | sonnet | P1 | Tool page | S1 D1 | — | merged | 4fb6e23 | 5fc4419 | 1 | gate --full PASS; ToolCard import repointed by manager |  |  |
| T2 | 4 | sonnet | P1 | Compare page, CompareLink, ShareButton | S1 D1 | 18 | merged | 4fb6e23 | 459484a | 1 | gate --full PASS; INV-18 green |  |  |
| E4 | 4 | sonnet | P1 | Visitor e2e integration | B1 T1 T2 | 19 | merged | 459484a | 2277486 | 1 | INV-19 green first run, no seams |  |  |
| V1 | 5 | opus ✓ | P1 | Reviews and helpful votes | A1 T1 | — | queued | | | | | | |
| U1 | 5 | sonnet | P1 | Saved tools, collections, `/library` | A1 B1 T1 | — | queued | | | | | | |
| N1 | 5 | sonnet | P1 | Notifications bell and feed | A1 | — | queued | | | | | | |
| M1 | 5 | sonnet | P1 | Admin and bundle interest | A1 B2 | 22 24 | queued | | | | | | |
| U2 | 5 | sonnet | P1 | Profile and settings | A1 | — | queued | | | | | | |
| U3 | 5 | opus ✓ | P2 | Delete account | U2 V1 | — | queued | | | | | | |
| E5 | 5 | sonnet | P1 | Signed-in e2e integration | V1 U1 N1 | 20 21 | queued | | | | | | |
| R2 | 6 | sonnet | P2 | Rules hardening: helpfulCount ≥ 0, size/type limits on photoUrl, authorPhotoUrl, collection toolIds (manager writes the oracle first) | R1 | — | merged | 459484a | 492597c | 1 | 146/146 rules tests; gate --full PASS |  |  |
| H1a | 6 | sonnet | P1 | Public pages polish: logos, 375 px, axe, error/loading states (pulled forward) | E4 | — | merged | 5411984 | 134e841 | 1 | gate --full PASS; axe clean (serious/critical) en+bg; no 375 overflow |  |  |
| H1 | 6 | sonnet | P1 | Accessibility, 375 px pass, loading/empty/error states | E5 | 25 | queued | | | | | | |
| H2 | 6 | sonnet | P2 | SEO: metadata, hreflang, sitemap, JSON-LD | E5 | — | merged | eae4f28 | 5411984 | 1 | gate --full PASS; 16 SEO tests; curl-verified |  |  |
| H3 | 6 | sonnet | P1 | Deploy prep docs (never deploys) | E5 | — | deferred | | | | | | |
| Q1 | 6 | sonnet | P2 | Visual QA against the prototype (read-only) | E5 | — | queued | | | | | | |
| W1 | 7 | manager | P1 | Final gate, screenshots, HANDOFF.md | — | — | queued | | | | | | |

## Decisions (made by the loop under the grant)

_One line each: time · decision · reason._

- 00:05 · H3 (deploy prep) moves to `follow-ups.md`, and no `apphosting.yaml` is written. The framework stays Next.js. · The owner said "we wont host yet". Next stays because SSR and SEO still matter whenever hosting happens.
- 00:11 · TypeScript pinned to 6.0.3 instead of latest 7.0.2 · Next 16 build relies on the TS JS API that the Go-native 7.x drops
- 00:11 · @types/node pinned to 22.20.5 · matches the Node 22 target in .nvmrc
- 00:11 · Layering is app → shell → features → shared → config (shell above features) · the shell composes feature slot components
- 00:14 · C1 starts before the Phase 1 gate · it is manager-owned, disjoint from L1's files, and everything else in Phase 1 is already green; the P1 gate runs as soon as L1 merges
- 00:14 · typedRoutes stays off · hrefs come from config/routes and the next-intl Link, which carries its own typing
- 00:19 · Public catalogue pages render per request (force-dynamic + React cache) instead of ISR · the build has no emulator to read from and INV-24 requires an admin-created tool to appear immediately; ISR/on-demand revalidation is a follow-up
- 00:28 · D1 and S1 start before C3 freezes the oracle · D1 owns no invariant and S1's only one (INV-14) is fully specified in O1's brief; this fills the 4 worker slots during Phase 2
- 00:41 · O1's probe rules are withheld from R1 · keeps the rules an independent reading of SPEC; the verifier then checks R1 blind
- 01:01 · A1 runs as a 5th concurrent worker · it is on the critical path for all of Phase 5; slots are port-isolated, the cap was about load
- 01:08 · ToolCard moved to features/catalogue with an actions slot (no feature imports) · library↔bundles and catalogue↔my-library would otherwise be import cycles (R12); contract fix by the manager
- 01:15 · H2 (SEO, P2) pulled forward into Phase 4's idle capacity · Phase 5 P1 lanes are blocked on A1 and H2 touches only public pages + metadata exports
- 01:21 · H1 split: H1a (public pages) pulled forward now; H1 keeps the signed-in pages after E5 · public features are frozen and Phase 5 lanes touch disjoint folders

## Events

_One line each: `- HH:MM (from date) <event>`._
- 00:11 F1 merged 94d5074 (husky green). L1 spawned (sonnet, SLOT 1, worktree ai-explore-wt/L1).
- 00:14 F2+F3 merged 716a73b: next build green, rules smoke + en/bg e2e smoke green in emulators (SLOT 0). Firestore emulator jar + Playwright chromium downloaded.
- 00:16 L1 gate --full PASS on 66b3eac (trunk merged in); squash-merged 01950c5. PHASE 1 GATE PASS on trunk: biome, conventions, node-tests, typecheck, test, rules, e2e.
- 00:19 C1 merged f9b8a32 (schemas, pricing INV-13, seed/share contract stubs). O1 spawned (opus, SLOT 1). C2 started by manager.
- 00:28 C2 merged e38f821 (+0865ad6 e2e fixture slugs, seed reviews contract). Full gate PASS after interim public-read rules + build-phase flag skip. O2 spawned (sonnet, SLOT 2).
- 00:30 D1 spawned (opus, SLOT 3), S1 spawned (sonnet, SLOT 4). O2 handed back 7e94505 (8 specs + fixtures), under C3 review.
- 00:31 O2 C3 review: fixed networkidle (Firestore channels never idle) and admin logo path; squash-merged 73406e8.
- 00:36 All lane briefs written ahead (R1, A1, B1, B2, T1, T2, E4, V1, U1, N1, M1, U2, U3, E5) + templates/feature-common.md. Waiting on O1, D1, S1.
- 00:37 S1 squash-merged 93a7b5b: catalogue (8 tools, 35 oEmbed-verified tutorials), idempotent seed, logos.
- 00:41 O1 + C3 squash-merged ef3c37c. PHASE 2 GATE PASS: pending exactly {1–12, 18–26}; oracle frozen. INV-13–17 green.
- 00:41 R1 spawned (opus, SLOT 1, verified). In flight: D1, R1.
- 00:52 R1 handed back 3a14181: 140/140 rules tests; gate --full PASS on caab940 (trunk merged; gate.sh mapfile bug fixed on trunk c0ee6bb, oracle owned-INV check now live). Verifier spawned.
- 00:59 D1 squash-merged 4fb6e23. Phase 4 lanes B1, B2, T1, T2 spawning; A1 waits for R1 verdict.
- 01:00 Phase 3 lanes S1, D1 merged; R1 under verification. PHASE 4 OPEN (ahead of box): B1, B2, T1, T2 spawned (sonnet, SLOTs 2–5).
- 01:01 R1 VERDICT PASS; squash-merged 80643ef. Brief gaps → R2 (P2 hardening) + follow-ups. A1 spawning as a 5th concurrent worker.
- 01:02 R2 oracle committed on trunk (525aa68): 4 hardening cases fail on current rules as expected. R2 queued for the next free slot.
- 01:07 B1 merged a8a9df3 (INV-26 green). vitest @ alias fixed on trunk 9762810 (found by B2); T1, T2, A1 notified.
- 01:08 Contract fix da8a161: ToolCard → features/catalogue (found by B2 gate R12 cycle). Briefs updated.
- 01:12 T1 merged 5fc4419, T2 merged 459484a (INV-18 green). Phase 4 remaining: A1 (running), E4 (now unblocked). Spawning E4 and R2.
- 01:12 E4 (sonnet, SLOT 2) and R2 (sonnet, SLOT 3) spawned. In flight: A1, E4, R2.
- 01:12 Manager visual review of B1/T1 screenshots: library grid and tool page match SPEC and prototype; wordmark logos (runway, elevenlabs, tableau-ai, jasper) are illegible in square tiles → H1 polish item.
- 01:14 E4 merged 2277486: INV-19 green on both projects. Phase 4 left: A1.
- 01:15 H2 spawned (sonnet, SLOT 4). In flight: A1, R2, H2.
- 01:17 R2 merged 492597c (rules hardening; slug length approximate ≤127 with hyphens, logged).
- 01:20 H2 merged 5411984 (SEO). In flight: A1 only.
- 01:21 H1a spawned (sonnet, SLOT 2). In flight: A1, H1a.
- 01:27 H1a merged 134e841.
