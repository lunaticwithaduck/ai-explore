**Template:** brief-v1 · **Task:** Z2c · **Phase:** 6 · **Model:** sonnet · **Base sha:** 267d8a0

# Z2c — Fix lane: admin gaps (SPEC §8)

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first, including every rule at its end. It is binding.
The QA report is `~/Repos/ai-explore/artifacts/qa/report.md`. Item IDs below refer to it. Q1's screenshots are on branch
`overnight/Q1`: `git show overnight/Q1:artifacts/qa/<file> > /private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/<file>`, then view it.
All 26 INVs are green on trunk and must stay green. The manager may send you a second batch from the release audit (Z1). Fold it in.
Gate: `scripts/gate.sh --full --task Z2c --base 267d8a0` → `GATE PASS`, with an empty pending list.
Hand-back: `~/Repos/ai-explore/prompt/overnight/tasks/Z2c/handback.md`, from the template, listing each item as fixed or skipped with the reason.
Never touch `app/src/features/account/delete/**`, `app/src/features/auth/hooks/useEnsureProfile.ts` or `app/src/features/account/settings/SettingsView.tsx`. U3 owns them.

## Items
1. **M10:** the Updates tab lists existing updates (collection group, newest first) with tool, version, kind and date, and
   lets an admin edit an update.
2. **M11:** the tool form gains the missing sections, all validated by `toolSchema`:
   - a tutorials repeater (youtubeId, title en/bg, minutes, difficulty);
   - a comparison fieldset (apiAccess, integrations, speed, outputQuality, bestUseCase en/bg);
   - multi-selects for similarToolIds and complementaryToolIds.
   Edits must still never write `rating`. INV-24 must stay green.
3. **M12:** specific, translated, per-field error messages (required, slug pattern, URL, hex colour, logo path, numbers), plus
   helper text and placeholders. Consider entering prices in dollars, converted to cents in one function, with a unit test.
4. **m18:** the slug gets its own full-width row. **m19:** Interest rows show bundle names, and the total is labelled.
   **m20:** admin row edit targets are 24 px or more.

## Scope
`app/src/features/admin/**`, `app/src/app/[locale]/(admin)/**`, `app/src/api/endpoints/admin.ts`,
`app/src/messages/{en,bg}/admin.json`, `artifacts/screens/Z2c-*`.
