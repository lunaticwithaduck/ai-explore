**Template:** brief-v1 · **Task:** <id> · **Phase:** <n> · **Model:** <model> · **Base sha:** <sha>

# <id> — <title>

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md`. It is binding.
2. <SPEC sections, by number>
3. <exemplar files, by path and line>

## Where you work
- Worktree `~/Repos/ai-explore-wt/<id>`, branch `overnight/<id>`, `SLOT=<n>` (already in `.env.slot`).
- Write only the paths in `~/Repos/ai-explore/prompt/overnight/tasks/<id>/scope.txt`.
- The one exception: your hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/<id>/handback.md`.

## Situation
<what exists on trunk that this task builds on: slots, readers, schemas, primitives>

## Goal
<one paragraph>

## Acceptance
Each criterion comes with its check.
- [ ] INV-<n>: `<command>` → passes
- [ ] <criterion> — check: `<command>` → <expected>
- [ ] `scripts/gate.sh --quick` → exit 0

## Slots
- Fills: <slot components this task implements>
- Consumes: <slot components it renders, which may still be stubs>

## Out of scope
<list>

## Stop conditions (do not guess)
Stop and hand back instead of guessing when:
- you need a file outside scope, a new dependency, or a new token;
- an invariant assertion looks wrong;
- you hit a permission prompt or classifier block (quote it verbatim);
- the brief contradicts CLAUDE.md or SPEC.

## Boundaries
- No push. No deploy. No real Firebase project: emulators with `demo-ai-explore` only.
- No `git add -A` or `git add .`. No `--no-verify`. No comments. No new dependencies.
- Never edit `INV-` assertions; only remove the `fixme` on the invariants you own.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` once your commit is in.
