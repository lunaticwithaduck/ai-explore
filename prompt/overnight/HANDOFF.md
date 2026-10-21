# Overnight run: handoff

Run 2026-10-21, 00:05 → 04:05 EEST. Design: `prompt/LOOP.md`. Full record: `prompt/overnight/ledger.md`.

## §0 State

AI Explore is built to the SPEC MVP and **all 26 invariants are green**. The final `scripts/gate.sh --full` on
`overnight/trunk` passes: Biome, the conventions linter, typecheck, 324 unit tests, 158 Firestore-rules tests, and 20 e2e
runs (10 specs × mobile 375 / desktop 1280), with no pending invariants.

The app runs entirely on the Firebase emulators (`demo-ai-explore`). It has never touched a real Firebase project and
nothing was deployed or pushed.

Beyond the invariants:
- **Two release-quality passes ran:** a visual/UX QA (Q1) and a correctness/security audit (Z1). Their blockers and majors
  were fixed, except M5 (Firebase SDK on every visitor page), which was deliberately deferred.
- **One known flake:** INV-24 on mobile failed once in about 20 runs (§4).
- **Run time:** wrap-up started at 03:55, about four hours early, because the remaining SPEC items are [LATER].

## §1 Run it and review it

```
cd ~/Repos/ai-explore
pnpm install
pnpm dev                         # Firestore + Auth emulators, seed, next dev on http://localhost:3000
```
- **Logins (emulator only):** admin `admin@ai-explore.test` / `admin-pass-123`; member `member@ai-explore.test` / `member-pass-123`.
  Or sign up any email.
- **Gate:** `scripts/gate.sh --full`. Rules only: `scripts/test-rules.sh`. e2e: `scripts/test-e2e.sh`.
- **Screenshots of every key page:** `artifacts/screens/final-*-{375,1280}.png`, regenerated with `scripts/capture-screens.mjs`
  (it needs a running `next start` inside the emulators; see its header).
- **Review order:** `prompt/SPEC.md` → `git log --oneline` (one commit per task) →
  `artifacts/qa/report.md` and `artifacts/qa/Z1-report.md` → `prompt/overnight/follow-ups.md`.
- **Merged:** `main` was fast-forwarded to `overnight/trunk` on 2026-10-21.

## §2 Where everything is

| What | Where |
|---|---|
| Code | `main` (fast-forwarded from `overnight/trunk`) |
| Per-task work | one squash commit per task on `main`, `[id]` in the subject; task branches and worktrees removed |
| Briefs, hand-backs, gate logs, verdicts | `prompt/overnight/tasks/<id>/` |
| Ledger: grant, decisions, events | `prompt/overnight/ledger.md` |
| Follow-ups (36) | `prompt/overnight/follow-ups.md` |
| Decisions that need you | `prompt/overnight/parked.md` (§5) |
| QA report + console log | `artifacts/qa/report.md`, `Q1-console-errors.tsv`; 195 screenshots on the local branch `overnight/Q1` (20 MB, not merged or pushed) |
| Release audit | `artifacts/qa/Z1-report.md` |
| Per-lane screenshots | `artifacts/screens/<task>-*.png` |

## §3 What was built

| Route | What it does | Screenshot |
|---|---|---|
| `/` · `/bg` | Library: search, category chips, tag/price filters (a "Filters" drawer on mobile), sort, URL state, compact cards (fixed logo tile, price and rating pinned), Bundles section | `final-library-*`, `final-library-bg-*` |
| `/tools/[slug]` | Header (logo, tags, live rating, Open, save, add to collection, share, compare), about, plans, tutorial carousel (click-to-load youtube-nocookie), updates (bare version numbers), reviews (write, edit, delete, helpful), similar carousel, "Works well with" | `final-tool-*` |
| `/bundles` · `/bundles/[slug]` | Bundle cards; month/quarter/year toggle; list price and savings from one pricing module; Notify me (checkout flag off) | `final-bundles-*`, `final-bundle-*` |
| `/compare?a=&b=` | Side-by-side table on the SPEC §6 rows; stacked layout at 375 | `final-compare-*` |
| `/library` | Saved tools and collections (create, rename, delete, add/remove), realtime | `final-my-library-*` |
| `/profile` · `/settings` | Stats, recent reviews, collections; display name, locale (persisted and routed), notification prefs, sign-out (waits for pending writes), **delete account** (reauth first; aggregates restored exactly) | `final-profile-*`, `final-settings-*` |
| bell (header) | Notifications derived from saved tools' updates, New badge, mark all as read, honours the product-updates preference | `final-notifications-*` |
| `/admin/**` | Tools (full form including tutorials, comparison, similar), bundles, updates (list and edit), interest counts; 403 for non-admins | `final-admin-*` |
| `/sign-in` · `/sign-up` · `/reset-password` | Email/password and Google; translated errors; safe `?next=` | `final-sign-in-*` |
| unknown URL | Dark, translated 404 | `final-not-found-*` |
| SEO | Localized metadata, hreflang, sitemap, robots, JSON-LD | (see H2 hand-back) |

The backend is `firebase/firestore.rules`: verified twice, then hardened twice. Reviews and votes move their aggregates
only through paired batches. Review bylines must mirror the author's profile.

## §4 Bugs found but not fixed (all in `follow-ups.md`)

1. **INV-24 mobile flake.** The sign-out helper once waited 30 s for the user menu after the admin create step. 10/10 passed
   on repeat. The trace is in `artifacts/qa/flake-inv24-mobile.md`.
2. **Visitors download the Firebase SDK** (~200 KB gzip) on every page (Z1 M5). The plan: lazy-load the auth listener and
   the Firestore client.
3. **Photo URLs.**
   - The rules accept a few https strings the client schema rejects, so such a review is hidden but still counted.
   - Any https host is allowed, so a profile photo can be a tracker image. Fix with CSP `img-src` or an allow-list at deploy.
4. **Account deletion leaves some data behind.** The user's helpful votes on others' reviews and `subscriptions` stay
   (the rules allow no client path). A second tab opened mid-deletion can re-create the profile.
5. **Orphaned votes** remain under deleted reviews.
6. **Catalogue rules gaps:** drafts' `updates` are publicly readable; reviews are allowed on unpublished tools; admins can
   still write `rating` directly.
7. **Bulgarian UI** shows tag chips as raw English slugs (tags have no localized names).
8. **Data quality:** prices and plans are prototype sample data, and three tutorials have odd durations.
9. **Catalogue rendering** is per request (no ISR).
10. **Reviews** load without pagination.

## §5 Decisions for you

- **Parked (`parked.md`):**
  - Q1-m29: should an explicit `/bg/...` URL override a signed-in user's saved locale? Kept as the SPEC states; the
    recommendation is a small "switch?" notice.
  - Q1-m30: Inter's Bulgarian letterforms. Kept; recommended to keep.
- **Hosting:** App Hosting needs the Blaze plan. The rules-only architecture still holds.
- **Payments provider for bundles:** `subscriptions` is reserved and client-unwritable.
- **Real catalogue:** verified prices and tutorials, and more tools.
- **M5 approach:** Firebase lazy-loading.

## §6 Held or unmerged work

Nothing is held. Every task merged except H3 (deploy prep), deferred on your word ("we wont host yet").
Branch `overnight/Q1` keeps the 195 QA screenshots on purpose.

## §7 Decisions the loop made under the grant (full list in the ledger)

- **Toolchain:** TypeScript 6.0.3, not 7.x (Next's build needs the JS compiler API). Layering is app → shell → features →
  shared → config.
- **Rendering:** catalogue pages render per request, not ISR (builds run without emulators; admin edits must show at once).
- **Contracts:** `ToolCard` moved to a shared `catalogue` domain with an `actions` slot, to break import cycles.
- **Scheduling:** several lanes pulled forward (SEO, public polish, QA) and up to 5 concurrent workers, to use idle capacity.
- **Phase 5 start:** lanes branched from A1's head while A1 was being verified.
- **Release passes:** after all INVs went green, a QA pass, a release audit and three fix lanes were added instead of idling.
- **Reviews:** require an author profile and mirror its name and photo (rules plus an amended oracle setup; no assertion changed).
- **Small calls:** emulators are opt-in by env (off by default); slugs are capped at 64; the oracle step guards existing
  test files only.

## §8 Guardrails, confirmed

- **No push and no remote.** No PR, no deploy, no `firebase login` or real project, no gcloud.
- **No secrets.**
- **Git discipline:** no `--no-verify`, no force operations, no history rewrite on trunk, and `git add` named files.
- **No changes** to `.claude/` settings during the run, and no dependencies added outside PLAN §0.
- **Writes** went only into `~/Repos/ai-explore`, `~/Repos/ai-explore-wt/` (now empty), the session scratchpad and a few
  `/tmp/*.log`/`.pid` files for local servers. Other repos were read only.
- **One mistake:** a stray screenshot folder written outside any worktree was deleted. It turned out to differ slightly from
  the committed copy; only an alternate screenshot was lost (ledger, 01:59).

## §9 Numbers

| | |
|---|---|
| Tasks | 37 merged · 1 deferred (H3) · 0 parked |
| Extra rounds | A1 2 · U1 2 · M1 2 · U3 3 · R3 2 (everything else first round) |
| Verifier verdicts | R1 PASS · A1 FAIL (open redirect) → PASS · V1 PASS · U3 FAIL → FAIL → PASS |
| Tests | 324 unit (app 280, ui 18, schemas 17, seed 9) · 158 rules · 10 e2e specs × 2 viewports |
| Code | ~19.1k source lines · ~5.4k test lines · 49 commits beyond `main` |
| Phase gates | P1 00:16 · P2 00:41 · P3 01:01 · P4 02:03 · P5 02:23 · INVs all green 02:39 · fixes to 03:55 · W1 04:05 |

## §10 Next steps to launch

1. ~~Review, then fast-forward `main`.~~ Done 2026-10-21.
2. Create the Firebase project on Blaze and an App Hosting backend (H3 in `follow-ups.md`).
3. Set the env in `apphosting.yaml` with `NEXT_PUBLIC_USE_EMULATORS=false`.
4. Deploy `firebase/firestore.rules` and `firestore.indexes.json`.
5. Create the first admin by hand (`admins/{uid}`).
6. Replace the sample catalogue with verified facts.
7. Add a CSP (`img-src`), lazy-load Firebase (M5), and pick a payments provider.

**Process notes for the next loop:**
- **The verifiers paid for themselves.** They caught an open redirect, a profile-resurrection race and two reauth dead ends
  that every test missed.
- **Parallel lanes mostly broke at integration:** hydration mismatches, global RTK endpoint names, import cycles and
  add/add conflicts on shared files. `feature-common.md` now carries rules for each.
- **Add a fresh-context hydration check** (6 cold loads per route) to `gate.sh`. That blocker only showed up in QA.
- **Always re-run a worker's "GATE PASS"** on the final commit. One was stale.
