**Template:** brief-v1 · **Task:** H1 · **Phase:** 6 · **Model:** sonnet · **Base sha:** 78f3369

# H1 — Accessibility (INV-25), signed-in polish, and verifier follow-ups

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first, including every rule added at its end. It is binding.

Every feature is merged and every invariant except INV-25 is green on trunk. This lane makes the whole app pass axe and
polishes the signed-in pages. The public pages were already polished by H1a. A QA report (Q1) is being written in parallel;
the manager may send you a second batch from it.

## Scope
- `app/src/features/**`, except `app/src/features/account/delete/**` (U3 owns it);
- `app/src/shell/**`;
- `packages/ui/src/components/**` (fixes only, no API removals);
- `app/src/messages/{en,bg}/*.json`, except `account.json` keys under `delete.*`;
- `app/e2e/inv-25-accessibility.spec.ts` (un-fixme only);
- `artifacts/screens/H1-*`.

## Work list
1. **INV-25.** Un-fixme `app/e2e/inv-25-accessibility.spec.ts` and make it green on both projects. It axe-scans the
   library, `/tools/midjourney`, `/bundles/startup-founder-pack`, `/compare?a=midjourney&b=stable-diffusion`, and settings
   while signed in, failing on serious or critical violations. Also run axe yourself (throwaway script outside the repo) on
   `/library` with a collection, profile, the admin dashboard and the new-tool form, the notifications panel open, the
   add-to-collection menu open, the review delete dialog, and sign-in, sign-up and reset, at 375 and 1280, in en and bg.
   Fix every serious or critical violation, plus these moderate ones:
   - `heading-order` on the library and `/bundles`, where card h3s follow the h1: add a proper h2 section heading;
   - `image-redundant-alt` on compare.
2. **Verifier follow-ups:**
   - `features/reviews/utils/reviewAuthor.ts:20`: clip names with `.slice(0, 60)` (UTF-16, as the rules count), not by
     code points. Add a unit test with emoji.
   - The tool header's average (`features/tool`) is server-read and disagrees with the live summary after a review. Make the
     header rating live, e.g. through `useToolRatingQuery` from `@/api/endpoints/reviews` seeded with the server value.
     The header must still carry **no** `tool.ratingAverage` or `tool.ratingCount` test ids.
   - When the reviews query fails, the review composer keeps its loading skeleton forever. Show the translated error state instead.
3. **Signed-in polish at 375 and 1280:** `/library` (collections), profile, settings, the admin dashboard and forms,
   the notifications panel, the add-to-collection dialog, the mobile menu sheet. Fix horizontal overflow, clipped or overlapping
   text, inconsistent spacing, and missing loading, empty or error states. Keep it restrained; do not redesign.
4. **Batch 2:** if the manager sends Q1 findings while you work, fix them in the same lane.

## Acceptance
- [ ] INV-25 is un-fixme'd and green on both projects. Every other INV stays green.
- [ ] Your extra axe sweep finds no serious or critical violations. List any moderate ones you leave.
- [ ] Screenshots: `artifacts/screens/H1-{my-library,profile,settings,admin,notifications}-{375,1280}.png`, and you viewed them.
- [ ] `scripts/gate.sh --full --task H1 --base 78f3369` → `GATE PASS`. The printed pending list must be **empty**.
- [ ] Write your hand-back to `~/Repos/ai-explore/prompt/overnight/tasks/H1/handback.md` from the template.
