# Z3 hand-back · round 1

**Head sha:** 17de179 · **Gate:** `scripts/gate.sh --full --task Z3 --base d95d057` → GATE PASS (pending list empty)

## Criteria
| item | where | proof |
|---|---|---|
| M2 | api/server/withTimeout.ts (+test), catalogue.ts, updates.ts | slot-2 Firestore paused with kill -STOP: `/` 200 in 4.02 s, `/sign-in` 200 in 4.5 s, `/tools/jasper` 200 in 4.0 s; resumed `/` 0.03 s |
| M3 | notifications hooks/Menu/Panel, messages | NotificationsBell.test (no badge, off panel, link to /settings); INV-21 green |
| M4 | authActions.signOutUser, hooks/useSignOut.ts (+test), UserMenu, AccountArea | useSignOut.test: saving state, 5 s timeout signs out and raises warning shown in AccountArea |
| m2 | features/admin hooks/useCreateTool.ts, utils/createOnce.ts, ToolFormView, ToolForm | getDoc check + runTransaction that fails if the doc exists; navigates to edit page; INV-24 green |
| m4 | auth/utils/displayName.ts (+test), applied in toAuthUser | grapheme cut, <= 60 units |
| Bulgarian | messages/bg (+ en plurals) | see below |
| Small | routes.adminUpdate used in UpdatesTab; admin.updates.hint removed | |

## Decisions I made that the brief didn't dictate
- m2 uses the regular Firestore SDK (not the lite writer in api/endpoints/admin.ts) because that file is outside scope.scope.txt. Create no longer goes through the saveTool mutation; it invalidates the AdminTool tag after success. A module flag shows the "Saved." notice on the edit page after create (INV-24 asserts it).
- m4: the cut is in `toAuthUser` (sign-in path); `profileSeed.ts` untouched.
- M4: the warning is a small external store in useSignOut.ts, shown in AccountArea (UserMenu unmounts at sign-out).
- Bulgarian: informal imperatives mapped to polite forms across all bg namespaces except reviews.json; plural variable names kept (`days`, `count`) so no t() call changes were needed. "AI" before words became "ИИ"; "Ревюта" became "Отзиви" outside delete.*; "тагове" became "етикети"; "Върви добре с" became "Работи добре с".

## Not done, and why
- **m1 skipped:** DeleteReviewDialog lives in features/reviews/components (R3 owns it).
- bundle/update create still use plain create semantics through saveBundle/createUpdate (setDoc overwrite); only tools got the transaction, as briefed.

## For the manager
- scope.txt lists useSignOut.test.ts and displayName.ts, which I used; api/endpoints/admin.ts is not in scope, so a lite-transaction create could be a follow-up.
- Screenshots: artifacts/screens/Z3-{library-bg,compare}-{375,1280}.png.
