**Template:** brief-v1 · **Task:** M1 · **Phase:** 5 · **Model:** sonnet · **Base sha:** <set at spawn>

# M1 — Admin curation and bundle interest

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
- `app/src/features/admin/**`, `app/src/features/bundle-interest/**`;
- `app/src/app/[locale]/(admin)/admin/**` (you may add route files for `tools/new`, `tools/[slug]`,
  `bundles/[slug]` and `updates/new`; keep them thin and render your Views);
- `app/src/api/endpoints/{admin,bundleInterest}.ts`;
- `app/src/messages/{en,bg}/{admin,bundleInterest}.json`;
- `app/e2e/inv-22-bundle.spec.ts`, `app/e2e/inv-24-admin.spec.ts` (un-fixme only);
- `artifacts/screens/M1-*`.

Stubs you replace: `features/admin/components/AdminGate/AdminGate.tsx`, `features/admin/dashboard/AdminView.tsx`,
and the slot `features/bundle-interest/components/NotifyMeButton/NotifyMeButton.tsx` (`{ bundleId, period }`).

## Owns
INV-22 and INV-24.

## Goal
- **AdminGate:** uses `useCurrentUser()` and `useIsAdmin()` (A1).
  - loading → a skeleton;
  - signed out → sign-in with `?next=`;
  - not an admin → a 403 view with `admin.forbidden`;
  - admin → the children.
  The rules are the real guard; this is UX.
- **AdminView:** tabs for Tools, Bundles, Updates and Interest.
  - **Tools tab:** rows `admin.toolRow` (`data-id`) with a published badge and edit link, plus `admin.newTool`
    linking to `routes.adminNewTool`. Admins read **all** tools, published or not.
- **Tool form** (create and edit) uses react-hook-form + zod built from `toolSchema`.
  - **Required fields:** `slug` (create only), `name`, `developer`, `websiteUrl`, `tagline.en/bg`,
    `description.en/bg`, `categoryId` (a native-select primitive or Select), `logo.path` (must match
    `/logos/*.png|svg|webp`), `logo.background` (`#RRGGBB`) and `pricing.hasFreePlan`. Each carries
    `adminToolField('<dotted.name>')`.
  - **Also editable:** plans, tags, trial days and features. Keep this simple: repeatable rows.
  - **Plus** `admin.publishToggle` (a Switch) and `admin.saveTool`.
  - **On create, write a complete valid document**, because the server reader drops invalid ones:
    - `rating {count:0,sum:0}`, `tutorials []`, `features []`, `plans []`;
    - `comparison { apiAccess:'none', integrations:0, speed:3, outputQuality:3, bestUseCase: tagline }`;
    - `similarToolIds []`, `complementaryToolIds []`;
    - `createdAt`, `updatedAt` and `lastReleaseAt` from `serverTimestamp()`;
    - `pricing.fromPriceCents = cheapestPaidPlanCents(plans)`, omitted when undefined.
  - **On edit, never write `rating`.**
- **Bundles tab:** list and edit name, description, toolIds, accent, prices and published.
  **Updates tab:** create an update for a tool (version, kind, EN/BG title and changes).
- **Interest tab:** a collection-group read of `bundleInterest`, counted per bundle and period, shown in
  `admin.interestCount` (`data-id=<bundleSlug>`).
- **NotifyMeButton** (SPEC §10):
  - signed out → a link to sign-in with `?next=`;
  - signed in → subscribe realtime to `users/{uid}/bundleInterest/{bundleId}`:
    - if it exists, show `bundleInterest.registered` and no active `notifyMe`;
    - else show `bundleInterest.notifyMe`, which creates `{ period, createdAt: serverTimestamp() }`. It is
      idempotent: no write when the doc exists.

## Acceptance
- [ ] INV-22 and INV-24 are un-fixme'd and green.
- [ ] Unit tests: the tool-form defaults produce a document that passes `toolSchema` (with Dates
      substituted for the server timestamps), and the interest counting.
- [ ] `scripts/gate.sh --full --task M1 --base <base> --expect-pending <given at spawn>` → `GATE PASS`.
- [ ] Screenshots: the admin tools tab and the new-tool form at 1280, and the bundle detail with Notify me registered at 375.
