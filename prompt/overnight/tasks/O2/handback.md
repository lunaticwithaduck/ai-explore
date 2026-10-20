# O2 hand-back · round 1

**Head sha:** 7e94505 · **Gate:** `scripts/gate.sh --full --task O2 --base 0865ad6` → GATE PASS (pending 19-26)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| 8 fixme specs INV-19..26 | app/e2e/inv-19-visitor.spec.ts .. inv-26-card-layout.spec.ts | gate pending step | 0 |
| fixtures typecheck | app/e2e/fixtures/auth.ts, emulator-rest.ts | pnpm --filter @ai-explore/app typecheck | 0 |
| specs list | app/e2e | pnpm exec playwright test --list (20 tests) | 0 |
| gate | - | scripts/gate.sh --full --task O2 --base 0865ad6 | 0 |

## Decisions I made that the brief didn't dictate
- INV-19 carousel: click next repeatedly until the last tutorial item is fully inside the viewport, then assert toBeInViewport — works for any items-per-view.
- INV-23 reads the BG tagline with readFileSync via testInfo.config.rootDir (JSON import fails under Playwright's loader).
- INV-24 best-effort deletes the created tool in `finally` via emulatorRest on `tools/<slug>` (assumes collection `tools`, doc id = slug).
- INV-24 logo.path = 'logos/e2e.png', logo.background = '#ffffff', category = image; assumes these validate.
- INV-22 requires the 3 periods to yield 3 distinct price|listPrice|savings strings.
- INV-20 uses `reviews.ratingInput` as the container of `data-id=1..5` options; edit reuses `reviews.form`.

## Slots
- Filled: none (specs only)
- Consumed while still stubbed: none

## Not done, and why
- Specs were not executed (UI is stubbed; all fixme).

## For the manager
Contract gaps / assumptions implementers must meet:
- No test id for review submit-after-edit vs create: spec assumes `reviews.form` + `reviews.submit` serve both.
- No test id for the "no rating" state; INV-20 asserts `tool.ratingAverage` is hidden/absent after deletion.
- Sign-out confirmation assumes `shell.signIn` is visible when signed out (on mobile it may be inside the menu; `.first()` toBeVisible is used, so it must be visible without opening the menu or the spec needs a tweak).
- INV-24 cleanup assumes Firestore path `tools/<slug>`; if different, update fixtures/emulator-rest usage (follow-up).
- `notifications.badge` must be absent (count 0) when nothing unread; the bell must be reachable without opening the mobile menu in INV-21 (or tweak).
