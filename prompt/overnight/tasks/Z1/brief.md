**Template:** brief-v1 · **Task:** Z1 · **Phase:** 6 (release audit) · **Model:** opus · **Base sha:** ce533a1

# Z1 — Release audit: correctness, security and robustness (read-only)

All 26 invariants are green. Your job is to find the bugs the tests do not cover, the way U3 found that
`useEnsureProfile` re-creates a deleted profile. You **change no product code**. You write a findings report,
and a fix lane will act on it.

## Read first
`prompt/CLAUDE.md`, `prompt/SPEC.md`, `firebase/firestore.rules` (verified; treat it as the contract),
`prompt/overnight/follow-ups.md` (known issues; do not re-report them), and the verdicts in `prompt/overnight/tasks/*/verdict.md`.

## Where you work
- Worktree `~/Repos/ai-explore-wt/Z1`, `SLOT=5`.
- Write only `artifacts/qa/Z1-report.md` in the repo. Probes and scripts go under
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/z1/`.
- Build with the slot env, then run inside `scripts/emulators-exec.sh` after `scripts/seed.sh`. Stop only the PIDs you started.

## Hunt for
1. **Writes the rules will reject in real use.** Every `setDoc`, `updateDoc`, `writeBatch` and `runTransaction` in
   `app/src` against the rules. Read each call site, and exercise the risky ones in the browser.
2. **Client-trusted values and authorization gaps.** Any UI that assumes the rules allow something they do not, or the reverse.
3. **Realtime listener leaks and duplicates.** Every `onSnapshot` and `onCacheEntryAdded` must unsubscribe, with no
   duplicate listeners per page. Measure the open listeners after navigating around.
4. **Auth edge cases:**
   - sign-out while a write is in flight;
   - session expiry;
   - two tabs (sign out in one);
   - Google sign-in for a user who has an email account with the same address.
5. **Races and idempotency:** double clicks on every mutating button, back and forward navigation, and slow network
   (`page.route` delays). Do this for save, collections, reviews, votes, notify me, the admin save and the locale switch.
6. **SSR and hydration:** any console error or warning on any route, signed in or out, at 375 or 1280.
7. **i18n:** any English string in the BG UI, unnatural Bulgarian, missing plurals, and dates and currency in `bg`.
8. **Performance red flags:** client bundle size per route (`next build` output), any page shipping Firebase Auth or
   Firestore to visitors who don't need it, and N+1 Firestore reads.
9. **Error states:** the emulator stopped mid-session, and Firestore offline.

## Output
`artifacts/qa/Z1-report.md` with:
- findings sorted **blocker**, **major**, **minor**;
- for each: repro steps, evidence (file:line, command and exit code, a log excerpt), impact, a suggested fix, and the owning folder;
- at the end, a **"fix tonight" list** of the top items that are safe to fix in under 30 minutes each.

## Acceptance
- [ ] Every hunt area has at least one recorded check, with "found nothing" stated explicitly where that is the case.
- [ ] Commit only the report:
  `git add artifacts/qa/Z1-report.md && git commit -m "docs(qa): release audit [Z1]"`, with a why-body and
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- [ ] `scripts/gate.sh --quick --task Z1 --base ce533a1` → `GATE PASS`.
