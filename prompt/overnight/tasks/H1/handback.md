# H1 hand-back · round 1

**Head sha:** 31ec569 · **Gate:** `scripts/gate.sh --full --task H1 --base 78f3369` → GATE PASS, pending list empty

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| INV-25 un-fixme'd, green on mobile and desktop | app/e2e/inv-25-accessibility.spec.ts:14 | gate --full (e2e) | 0 |
| Extra axe sweep (en+bg, 375+1280): library+collection, profile, settings, admin dashboard + new tool/bundle/update/edit forms, notifications panel, add-to-collection menu, new-collection dialog, review delete dialog, sign-in/up/reset | throwaway script outside repo | node sweep | 0 serious/critical |
| Screenshots viewed | artifacts/screens/H1-{my-library,profile,settings,admin,notifications}-{375,1280}.png | - | ok |
| Reviewer name clip by UTF-16 + emoji test | features/reviews/utils/reviewAuthor.ts | vitest | 0 |
| Live header rating, no ratingAverage/ratingCount ids | features/tool/components/ToolHeaderRating | vitest | 0 |
| Composer no longer stuck on skeleton when reviews query fails | features/reviews/components/ReviewComposer | - | 0 |

## Decisions I made that the brief didn't dictate
- Signed-out SaveToolButton link: removed aria-pressed (invalid on a link; was the critical aria-allowed-attr).
- Add-to-collection and user menus use modal={false} at call sites (UI primitive untouched; modal mode caused aria-hidden-focus).
- sr-only h2 headings (library.resultsTitle, bundles.list.resultsTitle, myLibrary.resultsTitle, en+bg) for heading-order, no visual change.
- Compare logos: aria-hidden (string alt literal is blocked by lint C1).
- text-subtle to text-muted in notification item, collection-menu empty text and DropdownMenuLabel (contrast).
- NotificationsPanel got aria-label (dialog name).
- Composer on query failure renders nothing; the section's existing translated alert shows the error.

## Slots
- Filled: none new. Consumed while still stubbed: none.

## Not done, and why
- Moderate "region" on the add-to-collection menu (Radix portal content) left; unavoidable.
- Batch 2 (Q1) never arrived.
- Per manager note I reverted my edit to SettingsView.tsx and did not touch useEnsureProfile.ts.

## For the manager
- Apply after U3 merges: app/src/features/account/settings/SettingsView.tsx main className `px-4 py-8` -> `px-4 py-8 sm:px-6` (ProfileView already done) so settings aligns with other pages at 1280 (currently 8px off).
- Settings screenshots were taken with the old padding.
