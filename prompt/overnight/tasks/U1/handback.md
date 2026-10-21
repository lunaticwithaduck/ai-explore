
## Round 2

**Head sha:** 09970be (on top of merge e432831). `scripts/gate.sh --full --task U1 --base 0d4c5a0 --expect-pending 20-21,25` -> GATE PASS (e2e exit 0, INV-19 and INV-24 green).

Two separate bugs, both fixed:
1. **Hydration mismatch (#418).** Auth can resolve before hydration finishes, so `SaveToolButton` and `AddToCollectionMenu` rendered a different tree than the server on the first client pass. `useSavedTools` and `useUserCollections` now report no uid and `signedOut: false` until `useHydrated()` (a `useSyncExternalStore` with a `false` server snapshot) is true. It reproduced only in the production build (`/` and `/tools/midjourney`), not in `next dev`. After the fix there are no pageerrors or console errors on `/`, `/tools/midjourney`, `/library` and `/admin/tools/new`, signed out, signed in, and as admin.
2. **INV-24 failure was not hydration.** My `saveTool` mutation shared its name with the admin `saveTool` in the single `firestoreApi`, so the admin form invoked mine and failed with "Cannot read properties of undefined (reading 'indexOf')" (shown as "Something went wrong"). Renamed mine to `saveToLibrary` / `unsaveFromLibrary` (hooks `useSaveToLibraryMutation`, `useUnsaveFromLibraryMutation`). Checked the other endpoint names across `api/endpoints/*`: no other collisions. Follow-up: injected endpoint names are global, so lanes should prefix them by domain.

Commits: 29ebebe (hydration), 09970be (rename).
