**Template:** brief-v1 · **Task:** N1 · **Phase:** 5 · **Model:** sonnet · **Base sha:** 60e02c9 (branched from overnight/A1, verification in progress)

# N1 — Notifications bell and derived feed

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/notifications/**`, `app/src/api/endpoints/notifications.ts`, `app/src/messages/{en,bg}/notifications.json`, `artifacts/screens/N1-*`.
Stub you replace: `features/notifications/components/NotificationsBell/NotificationsBell.tsx` (no props). The shell header renders it on mobile and desktop.

## Owns
The UI of INV-21 (`app/e2e/inv-21-notifications.spec.ts`). E5 un-fixmes it.

## Goal (SPEC §5)
- **Derived feed, no fan-out.**
  - Subscribe in realtime to `users/{uid}/saved` (the ids) and `users/{uid}` (`notificationsSeenAt`).
  - Query the `updates` **collection group** with `where('toolId', 'in', chunk)` (chunks of `FIRESTORE_IN_LIMIT`)
    and `where('publishedAt', '>=', now − NOTIFICATION_WINDOW_DAYS)`, ordered by `publishedAt` desc.
    Merge and sort the chunks.
  - Refetch when the saved ids change, so saving a tool makes its updates appear **without a reload**.
    INV-21 saves and expects the badge immediately.
  - Item tool names and logos come from the published tools. Use `getDoc` per distinct tool, cached in the
    endpoint, or a `tools` `in` query.
- **New** = `publishedAt > notificationsSeenAt`, where null means everything is New.
- **Bell:**
  - `notifications.bell`, an `IconButton` with a label;
  - `notifications.badge` shows the New count and is **not rendered** at 0;
  - a Popover `notifications.panel` lists `notifications.item` (`data-id=<updateId>`) with the tool logo,
    tool name, `formatVersion(version)`, title and relative date, plus `notifications.newLabel`, which reads
    "New" (ruling 6), on New items;
  - each item links to `routes.tool(toolId)`;
  - empty state.
- **Mark all as read:** `notifications.markAllRead` updates `users/{uid}` with `{ notificationsSeenAt: serverTimestamp() }`
  only, which is the INV-11 rule.
- When signed out, render nothing.
- The look comes from the prototype's notification dropdown
  (`reference/figma-make/src/app/components/Header.tsx`). The owner had its extra background container
  removed, so use the `Popover` primitive's own surface and add no wrapper background.

## Acceptance
- [ ] Unit tests: the New computation, chunking at 30, and merge order.
- [ ] `scripts/gate.sh --full --task N1 --base 60e02c9 --expect-pending 20-22,24-25` → `GATE PASS`.
- [ ] Screenshots: the bell with a badge and the open panel, at 375 and 1280.
