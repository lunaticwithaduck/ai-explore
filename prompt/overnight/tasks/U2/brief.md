**Template:** brief-v1 · **Task:** U2 · **Phase:** 5 · **Model:** sonnet · **Base sha:** <set at spawn>

# U2 — Profile and settings

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/account/**` except `features/account/delete/**`, `app/src/api/endpoints/profile.ts` (extend A1's file; do not break its exports), `app/src/messages/{en,bg}/account.json`, `artifacts/screens/U2-*`.
Stubs you replace: `features/account/profile/ProfileView.tsx` (`{ tools }`) and `features/account/settings/SettingsView.tsx`.

## Goal (SPEC §7, ruling 7)
- **Shared BackButton.** Both pages start with the same `BackButton` (`account.backButton`), top-left, which goes back or to the library.
- **Profile:**
  - avatar, display name and member since (from `users/{uid}.createdAt`);
  - counts: saved, collections, and reviews (a collection-group `reviews` query with `authorUid == uid`);
  - recent reviews, each with the tool's name and logo from the `tools` prop, stars, body and a link;
  - a collections overview linking to `routes.myCollection`.
- **Settings:**
  - display name (`account.displayNameInput` + `account.save`): updates `users/{uid}.displayName` and the
    Firebase Auth profile;
  - locale: a Select that persists to `users/{uid}.locale` and switches route locale. Reuse A1's
    locale-persistence hook if it exports one; otherwise write through the profile endpoint;
  - notification prefs: Switches for `productUpdates` and `emailDigest`. Email delivery is [LATER], so
    label it "coming soon";
  - sign out;
  - a **Danger zone** that renders `DeleteAccountSection` from `@/features/account/delete/DeleteAccountSection`.
    Create that file as a stub returning null; U3 owns it afterwards.
  - Fix contrast issues proactively: the prototype's settings page had low-contrast panels.

## Acceptance
- [ ] Unit test: settings form validation (display name 1–60).
- [ ] `scripts/gate.sh --full --task U2 --base <base> --expect-pending <given at spawn>` → `GATE PASS`.
- [ ] Screenshots: profile and settings at 375 and 1280.
