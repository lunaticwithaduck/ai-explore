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

## Worktrees

| id | path | branch | SLOT |
|---|---|---|---|
| trunk | ~/Repos/ai-explore | overnight/trunk | 0 |

## Tasks

Status values: `queued`, `working`, `gate`, `verifying`, `failed×n`, `escalated`, `parked`, `merged`, `held`, `deferred`.
A ✓ after the model means the task gets a verifier.

| id | phase | model | pri | title | depends on | INV | status | base | head | rounds | verdict | fail cause | LOC Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F1 | 1 | manager | P1 | Workspace, tooling, dependency install | — | — | queued | | | | | | |
| F2 | 1 | manager | P1 | App skeleton: Next 16, `[locale]`, next-intl, Tailwind → ui tokens, env | F1 | — | queued | | | | | | |
| F3 | 1 | manager | P1 | Firebase emulators, port slots, deny-all rules and smoke test | F1 | — | queued | | | | | | |
| L1 | 1 | sonnet | P1 | lint-conventions port, gate.sh, fixture tests | F1 | — | queued | | | | | | |
| F4 | 1 | manager | P1 | Husky, full gate green on the skeleton | F2 F3 L1 | — | queued | | | | | | |
| C1 | 2 | manager | P1 | `packages/schemas` and `pricing.ts` | F4 | 13 | queued | | | | | | |
| C2 | 2 | manager | P1 | App contracts: config, test-ids, firebase lib, api base, RSC readers, formatters, route stubs, slots, namespaces | C1 | 15 16 17 | queued | | | | | | |
| O1 | 2 | opus | P1 | Oracle: rules INV-1–12, unit INV-14 and INV-18 (`fixme`) | C1 | — | queued | | | | | | |
| O2 | 2 | sonnet | P1 | Oracle: e2e INV-19–26 and emulator fixtures (`fixme`) | C2 | — | queued | | | | | | |
| C3 | 2 | manager | P1 | Review oracles against SPEC, freeze | O1 O2 | — | queued | | | | | | |
| R1 | 3 | opus ✓ | P1 | Firestore rules and indexes | C3 | 1–12 | queued | | | | | | |
| S1 | 3 | sonnet | P1 | Seed data, seed script, logos, e2e admin | C3 | 14 | queued | | | | | | |
| D1 | 3 | opus | P1 | Design tokens, primitives, primitives page | C3 | — | queued | | | | | | |
| A1 | 4 | opus ✓ | P1 | Shell, auth, locale persistence | R1 D1 | 23 | queued | | | | | | |
| B1 | 4 | sonnet | P1 | Library view, ToolCard, filters | S1 D1 | 26 | queued | | | | | | |
| B2 | 4 | sonnet | P1 | BundlesSection, bundle list and detail | S1 D1 | — | queued | | | | | | |
| T1 | 4 | sonnet | P1 | Tool page | S1 D1 | — | queued | | | | | | |
| T2 | 4 | sonnet | P1 | Compare page, CompareLink, ShareButton | S1 D1 | 18 | queued | | | | | | |
| E4 | 4 | sonnet | P1 | Visitor e2e integration | B1 T1 T2 | 19 | queued | | | | | | |
| V1 | 5 | opus ✓ | P1 | Reviews and helpful votes | A1 T1 | — | queued | | | | | | |
| U1 | 5 | sonnet | P1 | Saved tools, collections, `/library` | A1 B1 T1 | — | queued | | | | | | |
| N1 | 5 | sonnet | P1 | Notifications bell and feed | A1 | — | queued | | | | | | |
| M1 | 5 | sonnet | P1 | Admin and bundle interest | A1 B2 | 22 24 | queued | | | | | | |
| U2 | 5 | sonnet | P1 | Profile and settings | A1 | — | queued | | | | | | |
| U3 | 5 | opus ✓ | P2 | Delete account | U2 V1 | — | queued | | | | | | |
| E5 | 5 | sonnet | P1 | Signed-in e2e integration | V1 U1 N1 | 20 21 | queued | | | | | | |
| H1 | 6 | sonnet | P1 | Accessibility, 375 px pass, loading/empty/error states | E5 | 25 | queued | | | | | | |
| H2 | 6 | sonnet | P2 | SEO: metadata, hreflang, sitemap, JSON-LD | E5 | — | queued | | | | | | |
| H3 | 6 | sonnet | P1 | Deploy prep docs (never deploys) | E5 | — | deferred | | | | | | |
| Q1 | 6 | sonnet | P2 | Visual QA against the prototype (read-only) | E5 | — | queued | | | | | | |
| W1 | 7 | manager | P1 | Final gate, screenshots, HANDOFF.md | — | — | queued | | | | | | |

## Decisions (made by the loop under the grant)

_One line each: time · decision · reason._

- 00:05 · H3 (deploy prep) moves to `follow-ups.md`, and no `apphosting.yaml` is written. The framework stays Next.js. · The owner said "we wont host yet". Next stays because SSR and SEO still matter whenever hosting happens.

## Events

_One line each: `- HH:MM (from date) <event>`._
