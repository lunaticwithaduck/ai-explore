**Template:** brief-v1 · **Task:** R2 · **Phase:** 6 · **Model:** sonnet · **Base sha:** 459484a

# R2 — Rules hardening

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md` §Firebase.
2. `firebase/firestore.rules`, written by R1 and verified.
3. `prompt/overnight/tasks/R1/verdict.md`, specifically BRIEF GAP items 2 and 4.
4. The oracle: `firebase/tests/rules/r2-hardening.test.ts` (`describe.skip('R2: …')`). Remove the `.skip` and nothing else.

## Scope
`firebase/firestore.rules`, `firebase/tests/rules/r2-hardening.test.ts` (un-skip only).

## Goal
Make R2 green while keeping all 139 INV tests and the smoke test green:
- `helpfulCount` may never become negative, so `isHelpfulCountUpdate` requires `>= 0`;
- `photoUrl` and `authorPhotoUrl`, when strings, have `size() <= 2048`;
- every collection `toolIds` entry is a string of at most 64 characters matching the slug regex
  `^[a-z0-9]+(-[a-z0-9]+)*$`. Use `toolIds.hasOnly` or an iteration-free form the rules language
  supports; if per-element checks are impossible, bound `size()` and use the closest enforceable check,
  and flag it.

Change as little as possible. Keep R1's function structure.

## Acceptance
- [ ] `scripts/test-rules.sh` → all green, including R2 (146 tests).
- [ ] `scripts/gate.sh --full --task R2 --base 459484a --expect-pending 19-25` → `GATE PASS`.

## Boundaries
No push, no deploy, no new dependencies. Named `git add` only. Commit as
`fix(firebase): rules hardening [R2]` with a why-body and `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
Hand back with the template.
