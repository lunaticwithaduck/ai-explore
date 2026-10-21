**Template:** brief-v1 · **Task:** Z2b · **Phase:** 6 · **Model:** sonnet · **Base sha:** 267d8a0

# Z2b — Fix lane: cards, collections, compare, library filters, bundles, logo

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first, including every rule at its end. It is binding.
The QA report is `~/Repos/ai-explore/artifacts/qa/report.md`. Item IDs below refer to it. Q1's screenshots are on branch
`overnight/Q1`: `git show overnight/Q1:artifacts/qa/<file> > /private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/<file>`, then view it.
All 26 INVs are green on trunk and must stay green. The manager may send you a second batch from the release audit (Z1). Fold it in.
Gate: `scripts/gate.sh --full --task Z2b --base 267d8a0` → `GATE PASS`, with an empty pending list.
Hand-back: `~/Repos/ai-explore/prompt/overnight/tasks/Z2b/handback.md`, from the template, listing each item as fixed or skipped with the reason.
Never touch `app/src/features/account/delete/**`, `app/src/features/auth/hooks/useEnsureProfile.ts` or `app/src/features/account/settings/SettingsView.tsx`. U3 owns them.

## Items
1. **M3 / ruling 4:** a uniform, compact one-line card footer. Price and an optional compact trial sit left, the rating sits
   right, and the price rows in a row share a y-coordinate. **m22:** one clean focus indicator on cards. INV-26 must stay green.
2. **M5:** at 375 the collection header stacks its actions under the title, so the title stays legible in bg.
   **m8:** a shorter bg placeholder for the new-collection field. **m28:** device-neutral empty copy.
3. **M4:** at 375 the bg Notify-me CTA has no clipping. Let it wrap, give it padding, and shorten the bg string.
4. **M6:** the compare table is readable at 375 with both tools visible (stacked label/value, sticky tool headers).
   **m10:** show "Free" for free-only tools. **m11:** a helpful empty state when no tools are chosen.
5. **M13:** at small widths, a "Filters" disclosure with an active count holds price, sort and tags, and the category chips
   become one horizontally scrolling row. **m16:** a "Clear filters (n)" control, and the bundles section hides while
   filtering. INV-19 and INV-26 must stay green.
6. **m1:** title the library bundles section "Bundles" / "Пакети". **m15:** the bundle price gets a period suffix.
7. **m2:** the ChatGPT logo.
   - Crop `app/public/logos/chatgpt.png` to its mark with `sips`, keeping it white.
   - Set a contrasting tile background in `firebase/seed/data/tools/chatgpt.ts` (dark grey that stands apart from the
     surface; the owner asked for a white logo on grey-black), e.g. `#3A3F4B`.
   - INV-14 must stay green.
8. **m6:** use "ИИ" consistently in bg UI copy (`common.json` tagline and your namespaces).
9. **m27:** in profile "Your collections", the whole card is the link.

## Scope
- `app/src/features/{catalogue,my-library,bundle-interest,compare,library,bundles}/**`;
- `app/src/features/account/components/ProfileCollections/**`;
- `app/src/messages/{en,bg}/{myLibrary,bundleInterest,compare,library,bundles,common}.json`;
- `firebase/seed/data/tools/chatgpt.ts`, `app/public/logos/chatgpt.png`;
- `artifacts/screens/Z2b-*`.
