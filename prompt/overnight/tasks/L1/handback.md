# L1 hand-back · round 1

**Head sha:** 4fb0f4c · **Gate:** `scripts/gate.sh --quick` → exit 0

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| every rule has positive and negative case | scripts/lint-conventions.test.cjs | `node --test 'scripts/**/*.test.cjs'` (72 pass) | 0 |
| `node --test scripts/` literally | n/a | fails on Node 24 (directory treated as module); gate uses `scripts/*.test.cjs` | see decisions |
| linter clean on trunk | scripts/lint-conventions.cjs | `node scripts/lint-conventions.cjs` | 0 |
| quick gate | scripts/gate.sh | `scripts/gate.sh --quick` → GATE PASS | 0 |
| task gate | scripts/gate.sh | `scripts/gate.sh --quick --task L1 --base 94d5074` → GATE PASS | 0 |
| sanity file | app/src/features/x/components/Bad/Bad.tsx (deleted) | linter reported R3, R1, R4, C1 | 1 as expected |
| biome | scripts/ | `pnpm exec biome check .` | 0 |

## Decisions I made that the brief didn't dictate
- `node --test scripts/` fails on the local Node 24 ("Cannot find module .../scripts"); Node 22 recurses directories. gate.sh runs `node --test scripts/*.test.cjs`, which works on both.
- Config layer is strict: `config` imports nothing from `app/src`, including other config files (literal reading of R12).
- Cross-feature cycles are direct A<->B only, reported at the first import of each direction; exposed through `lintProject(files)` (CLI uses it). `lintSource` alone cannot see cycles.
- `@/app/...` imports are errors for every file; relative imports inside the app layer are allowed.
- R4b only fires on brackets containing a digit followed by px/rem/em/vh/vw/% or `#`, to avoid false positives like `[--item]`.
- C1 also flags string-literal JSX children (`{'Hello'}`); HTML entities are ignored in JSX text.
- R4 hex: 3, 6 or 8 digits, not preceded by a word char or `&`.
- gate.sh step names: biome, conventions, node-tests, typecheck, test, rules, e2e, scope, oracle, pending.
- Oracle step: removed/added lines must be equal after stripping `.skip|.fixme|.todo(`; an unmarked line's first `INV-n` must be in the ledger INV cell. Only the non-owned-detection and "changed beyond markers" paths were exercised on a throwaway commit (since reset); the owned-INV path is untested end to end.

## Slots
- Filled: none
- Consumed while still stubbed: none

## Not done, and why
- `--full` steps call `scripts/test-rules.sh` and `scripts/test-e2e.sh`, which do not exist in this worktree; not run.

## For the manager
- The brief's acceptance `node --test scripts/` will fail on Node 24 as written; consider fixing wording or using Node 22.
- gate.sh writes `./gates.log` at the repo root by default; consider gitignoring it.
- Ledger INV column must stay `| ... | INV | status |` as the 8th pipe-field for the oracle parse.
