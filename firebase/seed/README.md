# Seed data

All content here is **sample data**. Prices and plans were taken from the owner's Figma Make
prototype and need human verification before any of it is shown as fact. Reviews, reviewers,
updates and bundle prices are invented for demonstration.

## Seeding

Start the emulators, then run `pnpm seed` (it goes through `scripts/seed.sh`, which applies the
worktree slot). The script refuses to run unless `FIRESTORE_EMULATOR_HOST` and
`FIREBASE_AUTH_EMULATOR_HOST` are set and the project is `demo-ai-explore`. It is idempotent: it can
run on every e2e run, and re-running it changes nothing. For a one-shot run:

    scripts/emulators-exec.sh "scripts/seed.sh"

It validates everything with `@ai-explore/schemas` before writing, creates the `E2E_ACCOUNTS` auth
users, the `admins/e2e-admin` document, `users/e2e-member` and its saved tool.

## Tutorials

Every `youtubeId` returned HTTP 200 from YouTube oEmbed, and `title.en` is the oEmbed title. Durations
come from each watch page (`lengthSeconds`, rounded to minutes). No duration is estimated.

Update dates are relative to when the seed data is constructed, so `midjourney` always has an update
in the last 7 days.
