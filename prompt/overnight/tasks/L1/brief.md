**Template:** brief-v1 · **Task:** L1 · **Phase:** 1 · **Model:** sonnet · **Base sha:** 94d5074

# L1 — Conventions linter, its fixture tests, and the gate script

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md`. It is binding. Pay particular attention to §App structure, §Design tokens and §Components.
2. `~/Repos/ai-explore/prompt/PLAN.md` §Gate script.
3. The exemplar (read-only, never modify): `~/Repos/majstorbg-estate/frontend/apps/web/scripts/lint-conventions.cjs`
   (945 lines; TypeScript-AST based). Port the mechanics (TS compiler API walk, reporting, rule
   structure); do not port its baseline/ratchet machinery: this repo is greenfield, zero tolerance.
4. `~/Repos/fakturcho/scripts/lint-tokens.cjs` for the T5 200-line rule and output style.

## Where you work
- Worktree `~/Repos/ai-explore-wt/L1`, branch `overnight/L1`, `SLOT=1` (in `.env.slot`).
- Write only the paths in `~/Repos/ai-explore/prompt/overnight/tasks/L1/scope.txt`.
- The one exception: your hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/L1/handback.md`.
- `scripts/lint-conventions.cjs` currently holds a one-line placeholder. Replace it.

## Situation
The trunk has a pnpm workspace with these packages: `app` (Next 16, almost empty), `packages/ui`,
`packages/schemas`, `firebase`. Root devDependencies include `typescript@6.0.3`, which has the full
compiler API; use it via `require('typescript')`. Node ≥ 22 means `node:test` and `node:assert`
are available. Use no new dependencies.

The manager is writing these in parallel on trunk; do not create them yourself:
- `scripts/slot.sh` (sourceable; exports `SLOT`, `APP_PORT`, `FIRESTORE_PORT`, `AUTH_PORT` and writes
  `.firebase.slot.json`)
- `scripts/test-rules.sh` (rules tests inside the emulators)
- `scripts/test-e2e.sh` (build, then e2e inside the emulators)

`gate.sh` only calls them.

## Goal

### `scripts/lint-conventions.cjs`

A CommonJS Node script that parses TS/TSX with the TypeScript AST and enforces the rules below.
- It exports `lintSource(relPath, sourceText) → Finding[]` for tests.
- When run directly, it scans the repo, prints `path:line:col  RULE  message — fix`, prints a count,
  and exits 1 on any finding.

**Files scanned:** `app/src/**`, `packages/ui/src/**`, `packages/schemas/src/**` and `firebase/seed/**`
(`.ts` and `.tsx`).

**Files skipped:** `*.test.*`, `*.spec.*`, `node_modules`, `.next`, and `reference/**`.

| Rule | Applies to | Check |
|---|---|---|
| R1 | everywhere scanned | No `style=` JSX attribute. Exception: files named `ToolLogo.tsx`. |
| R3 | outside `packages/ui/src` | No raw intrinsic elements `button input textarea select a img h1 h2 h3 h4 h5 h6 p label`. |
| R4 | outside `packages/ui/src/tokens/` | No hex colour (`#rgb`, `#rrggbb`, `#rrggbbaa`) in string, template or JSX text. Regex literals are exempt. `firebase/seed/**` is exempt from R4. |
| R4b | everywhere scanned | No arbitrary Tailwind values in class strings, i.e. any `-[...]` or `[...]` utility containing `px`, `rem`, `em`, `vh`, `vw`, `%` or `#`, e.g. `w-[13px]`, `text-[#f25c1f]`. |
| R5 | `.tsx` files | One React component per file: at most one top-level PascalCase function or const whose body returns JSX. |
| R5b | everywhere scanned | No nested `components/` folder inside a `components/` folder. |
| R7 | `app/src/**` | No string-literal `href="/…"`. |
| R7b | `app/src/**` | `useRouter`, `redirect`, `permanentRedirect` and `usePathname` must not be imported from `next/navigation`. |
| R7c | `app/src/**` | Nothing imports `next/link`. Both R7b and R7c point to `@/i18n/navigation`. |
| R8 | `app/src/**` | `next/font/google` and `next/font/local` are imported only in `app/src/app/fonts.ts`. |
| R12 | `app/src/**` | Layering: `app → shell → features → shared (api, lib, i18n) → config`. `config` imports nothing from `src`. `shared` imports only `config` and `shared`. `features` imports `shared` and `config` plus other features **only through** `@/features/<domain>/(components\|hooks\|utils\|config)/…`. `shell` imports anything below it. Nothing imports `@/app/…`. Cross-feature cycles (A→B and B→A) are errors. Resolve the `@/` alias to `app/src/`. |
| T5 | everywhere scanned | No file over 200 lines. `firebase/seed/data/**` is exempt. |
| C1 | `app/src/**` | No JSX text containing a letter or digit (Unicode `\p{L}` or `\p{N}`). No string-literal values on copy attributes `aria-label alt title placeholder label`. Copy goes through next-intl. |

### `scripts/lint-conventions.test.cjs`

Use `node:test`. Every rule gets at least one positive case (it flags) and one negative case (it
passes), written as inline source strings fed to `lintSource` under virtual paths. Do not create
fixture `.tsx` files on disk, because Biome and tsc would pick them up.

### `scripts/gate.sh`

Bash with `set -uo pipefail`. Every step runs even after an earlier one fails, so the report is
complete, but the script exits non-zero if any step failed (fail closed).

**Options**
- `--quick` (default) or `--full`
- `--task <id> --base <sha>`
- `--expect-pending <list>`, e.g. `1-12,14,18-26`
- `--log <path>`. The default is `./gates.log`. With `--task`, it is
  `<main>/prompt/overnight/tasks/<id>/gates.log`, where `<main>` is the first path printed by
  `git worktree list --porcelain`.

Source `scripts/slot.sh` first if it exists.

**Steps.** Each writes `STEP <name> → exit <n> (<seconds>s)` to the log. Only a short summary goes to stdout.
1. `pnpm exec biome check .`
2. `node scripts/lint-conventions.cjs`
3. `node --test scripts/`
4. `pnpm typecheck`
5. `pnpm test`
6. With `--full` only: `scripts/test-rules.sh`
7. With `--full` only: `scripts/test-e2e.sh`
8. **Scope** (with `--task`): every path in `git diff --name-only <base>..HEAD` must match a glob
   line in `<main>/prompt/overnight/tasks/<id>/scope.txt`. Use bash `[[ $p == $glob ]]`; document
   that `*` crosses `/`.
9. **Oracle** (with `--task`):
   - **Oracle files:** files under `firebase/tests/`, files under `app/e2e/`, and any `*.test.ts(x)`
     whose diff touches a line containing `INV-`.
   - **Allowed changes:** only line pairs where the removed line equals the added line after
     deleting `.skip`, `.fixme` or `.todo` before the `(`.
   - **Owned invariants:** the INV numbers unmarked must be within the task's `INV` column in
     `<main>/prompt/overnight/ledger.md`. Parse the task's table row, where the INV cell looks like
     `1–12`, `22 24` or `—`.
   - **Exempt tasks:** O1, O2, C1, C2, C3, F1–F4 and L1 skip this step.
10. **Pending:**
    - Find `(it|test|describe)(.only)?.(skip|fixme|todo)(` whose first argument string starts with
      `INV-<n>` in `firebase/`, `app/`, `packages/` and `scripts/`. Exclude `node_modules` and `.next`.
    - Print the sorted unique pending numbers.
    - With `--expect-pending`, fail when the set differs.

**Ending:** print `GATE PASS` or `GATE FAIL (<failed steps>)` as the last line.

## Acceptance
- [ ] `node --test scripts/` → exit 0; every rule has a positive and a negative case.
- [ ] `node scripts/lint-conventions.cjs` → exit 0 on the current trunk tree.
- [ ] `scripts/gate.sh --quick` → `GATE PASS`. Steps 6 and 7 are skipped under `--quick`.
- [ ] `scripts/gate.sh --quick --task L1 --base 94d5074` → `GATE PASS`. The scope step sees only your three files.
- [ ] Linter sanity check: a throwaway `app/src/features/x/components/Bad/Bad.tsx` with
  `<button style={{color:'#fff'}}>Hi</button>` produces R1, R3, R4 and C1 findings. Delete the file
  afterwards and do not commit it.
- [ ] `biome check scripts/` → clean. No file over 200 lines? This repo's T5 does not scan
  `scripts/`, but keep the linter readable; splitting it into `scripts/lint-conventions/*.cjs`
  modules is **not** allowed by scope, so a single file is fine.

## Out of scope
`slot.sh`, `test-rules.sh`, `test-e2e.sh`, `package.json`, `.husky`, any app code.

## Stop conditions (do not guess)
- A rule cannot be implemented without a new dependency.
- The TypeScript 6 compiler API behaves differently from what the exemplar expects in a way you
  cannot resolve.
- You need a file outside scope.

In any of these cases, hand back with what you have.

## Boundaries
- No push. No deploy. No `git add -A` or `git add .`. No `--no-verify`. No comments, except a
  one-line rule ID above each rule block if needed for navigation.
- Commit message: `feat(scripts): conventions linter, fixture tests and gate script [L1]`,
  with a short why-body and the line
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` into
`~/Repos/ai-explore/prompt/overnight/tasks/L1/handback.md` once your commit is in.
