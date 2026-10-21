# Z2a hand-back · round 1

**Head sha:** c645a86 (branch overnight/Z2a) · **Gate:** `scripts/gate.sh --full --task Z2a --base 267d8a0` → GATE PASS, pending list empty

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| B1: 0 pageerrors / hydration warnings, 6x fresh context, 375 and 1280, 7 routes (+2 404 routes) | app/src/api/StoreProvider.tsx | scratchpad hyd.cjs inside emulators-exec | 0 |
| INV-20 10x (x2 projects) green | app/src/api/endpoints/reviews.ts | playwright test inv-20 --repeat-each=10 | 0 (20 passed) |
| Full gate | - | scripts/gate.sh --full --task Z2a --base 267d8a0 | 0 |

## Items
- 1 B1 fixed: StoreProvider passes pristine `serverState` to Provider.
- 2 INV-20 fixed: toolRating listener uses `includeMetadataChanges: true` and ignores `hasPendingWrites` snapshots (without metadata changes the confirmed snapshot never fires).
- 3 M7 fixed (useNow). 4 M1, m12 fixed (catch-all, root not-found, button/centred); m12 "Page not found" document title skipped: needs generateMetadata in a page.tsx outside scope.
- 5 M8 fixed (text-subtle 0.66). 6 M2, M9, m3, m25, m9 fixed. 7 m13 fixed.
- 8 m26 (Select renders selected label explicitly), m17, m24 (header sign-in hidden on auth routes, password toggle, link padding) fixed.
- 9 m21, 10 m5, 11 m7 fixed. m4: the only "Ревюта" in auth.json was the sign-in subtitle ("ревюта" -> "отзиви"); the account.json occurrences are out of scope, skipped.
- m24 Google mark not in the brief list for Z2a, not done.

## Decisions I made that the brief didn't dictate
- NotFoundView keeps its prop-less signature (`[locale]/not-found.tsx` is out of scope); new NotFoundContent takes strings, used by root not-found.
- Removed `tool.header.noRating` key (replaced by `noReviews`) in both locales.

## Not done, and why
- m12 document title; account.json "Ревюта"; Z1 second batch not received.

## For the manager
- Screens: artifacts/screens/Z2a-{tool-jasper,404,sign-in}-{375,1280}.png.
