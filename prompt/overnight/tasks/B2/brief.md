**Template:** brief-v1 · **Task:** B2 · **Phase:** 4 · **Model:** sonnet · **Base sha:** 4fb6e23

# B2 — Bundles: library section, list and detail

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/bundles/**`, `app/src/messages/{en,bg}/bundles.json`, `artifacts/screens/B2-*`.
Stubs you replace:
- `features/bundles/components/BundlesSection/BundlesSection.tsx` (`{ bundles, tools }`);
- `features/bundles/list/BundleListView.tsx` (`{ bundles, tools }`);
- `features/bundles/detail/BundleDetailView.tsx` (`{ bundle, tools }`).

## Owns
No INV of its own, but INV-22's price steps (`app/e2e/inv-22-bundle.spec.ts`) must pass on your UI. M1
un-fixmes INV-22 once Notify me lands.

## Goal (SPEC §10)

**Pricing.** All prices come only from `summarizeBundlePeriod(priceCents, toolFromPrices, period)` in
`@ai-explore/schemas`, with `toolFromPrices = tools.map(t => t.pricing.fromPriceCents)`.

**BundlesSection** (on the library):
- heading plus "See all" linking to `routes.bundles`;
- bundle cards (`bundles.card`, `data-id=<slug>`) with accent colours (`accent-<name>` tokens), stacked
  `ToolLogo`s of the included tools, the monthly price, a "Save N%" badge, and a link to `routes.bundle(slug)`;
- the prototype's `reference/figma-make/src/app/components/BundlesSection.tsx` is the look.

**BundleListView:** every bundle as cards, with intro copy.

**BundleDetailView:**
- Header: icon, name, description and accent.
- Period selector: a radiogroup of `bundles.periodOption` (`role=radio`, `aria-checked`,
  `data-id=monthly|quarterly|yearly`), monthly by default.
- Price block: `bundles.price`, a struck-through `bundles.listPrice`, `bundles.savings` ("Save 26%"), and
  per-month for quarterly and yearly.
- The included tools, using `ToolCard` from `@/features/catalogue/components/ToolCard/ToolCard`.
- The CTA:
  - if `useFlag('checkoutEnabled')`, a `bundles.subscribe` button;
  - otherwise `NotifyMeButton` from `@/features/bundle-interest/components/NotifyMeButton/NotifyMeButton`
    (stub until M1) with `{ bundleId, period }`.

## Acceptance
- [ ] Unit tests: the detail view switches period and updates price, list price and savings; Subscribe
      is absent when the flag is off.
- [ ] INV-22's period steps pass when run locally: temporarily un-fixme it in your worktree and expect a
      failure only at the Notify me step, but do **not** commit the un-fixme.
- [ ] `scripts/gate.sh --full --task B2 --base 4fb6e23 --expect-pending 1-12,18-26` → `GATE PASS`.
- [ ] Screenshots: the library bundles section at 1280, and bundle detail at 375 and 1280.
