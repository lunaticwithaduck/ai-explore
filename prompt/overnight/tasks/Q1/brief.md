**Template:** brief-v1 · **Task:** Q1 · **Phase:** 6 (pulled forward) · **Model:** opus · **Base sha:** 20ce5be

# Q1 — Visual and UX QA of the whole app (read-only)

You are a demanding product QA reviewer. You **change no product code**. You produce the work list that H1 will fix.

## Read first
1. `~/Repos/ai-explore/prompt/SPEC.md`, especially §3 (routes), §9 (binding design rulings 1–11) and §Invariants.
2. The prototype for intended look and feel: `reference/figma-make/src/app/components/*` (read the code; it is not running).
3. `~/Repos/ai-explore/prompt/overnight/follow-ups.md` for known issues; do not re-report them unless they are worse than described.

## Where you work
- Worktree `~/Repos/ai-explore-wt/Q1`, `SLOT=3`. You may write only `artifacts/qa/**`.
- Build with the slot env (`bash -c 'source scripts/slot.sh && pnpm --filter @ai-explore/app build'`), then run
  `next start` inside `scripts/emulators-exec.sh` after `scripts/seed.sh`.
- Drive Chromium with a Playwright script kept outside the repo, under
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/q1/`.
  Stop only the server PID you started.

## Coverage
Capture every route at **375** and **1280**, in **en** and spot-checks in **bg**:
- **Visitor:** library, filtered library, empty search, tool page (midjourney, jasper), bundles, bundle detail, compare,
  share popover open, sign-in, sign-up, reset password, a 404.
- **Signed in** (sign up a fresh user through the UI; use `E2E_ACCOUNTS.member` and `E2E_ACCOUNTS.admin` from
  `firebase/seed/accounts.ts` where useful): header and user menu, mobile menu sheet, save a tool, add-to-collection
  menu plus the new-collection dialog, `/library` with a collection, notifications open, reviews (write, edit, delete
  dialog), profile, settings.
- **Admin:** dashboard tabs, new-tool form, the 403 view for a non-admin.
- Record console errors and page errors on every page. Treat any hydration warning (React #418/#423/#425) as a **blocker**.

## Output
- `artifacts/qa/Q1-<page>-<width>[-bg].png` screenshots.
- `artifacts/qa/report.md`: a table of findings sorted by severity (**blocker**, **major**, **minor**). Each finding has:
  route, viewport, locale, screenshot, what is wrong, expected (SPEC ruling or prototype file), suggested fix, and the owning
  folder (e.g. `features/my-library`, `packages/ui`, `shell`).
  Cover visual (spacing, alignment, contrast, truncation, overflow, empty and loading states), interaction (focus, keyboard,
  tap targets, dead clicks), copy (untranslated, awkward or inconsistent strings, en and bg) and SPEC §9 compliance.
- End the report with a **top 10 to fix tonight** list.

## Acceptance
- [ ] Every route listed above is captured at both widths, and the report lists console and page errors per page (or "none").
- [ ] `git status` shows only `artifacts/qa/**`. Commit them with
  `git add artifacts/qa && git commit -m "docs(qa): visual and UX QA report [Q1]"`, with a short why-body and
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- [ ] `scripts/gate.sh --quick --task Q1 --base 20ce5be --expect-pending 20,21,25` → `GATE PASS`.
