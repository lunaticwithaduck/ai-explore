**Template:** brief-v1 · **Task:** T2 · **Phase:** 4 · **Model:** sonnet · **Base sha:** 4fb6e23

# T2 — Compare page, CompareLink, ShareButton, clipboard

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/compare/**`, `app/src/features/share/**`, `app/src/messages/{en,bg}/{compare,share}.json`,
`artifacts/screens/T2-*`.
Stubs you replace:
- `features/compare/compare/CompareView.tsx` (`{ tools, firstId, secondId }`);
- the slots `features/compare/components/CompareLink/CompareLink.tsx` (`{ toolId, otherToolId }`) and
  `features/share/components/ShareButton/ShareButton.tsx` (`{ url, title }`);
- `features/share/utils/copyToClipboard.ts`.

## Owns
INV-18 (`app/src/features/share/utils/copyToClipboard.test.ts`, written by O1). Remove its `.skip` only.

## Goal

### `copyToClipboard`
Implement exactly the INV-18 contract: try the Clipboard API; on reject or when it is missing, fall back
to an off-screen textarea plus `execCommand('copy')`; never throw. This is the only place in the app
that writes raw DOM, by necessity.

### CompareView (SPEC §6)
- Two columns (`compare.column`, `data-id=<slug>`) inside `compare.table`.
- Rows: from-price, free plan, trial, features, API access, integrations, speed (1–5 meter), output
  quality (1–5 meter) and best use case.
- The second tool is chosen with a searchable picker (`compare.picker`, options `compare.pickerOption`
  with `data-id`). It defaults to the first tool's first similar tool. Changing it updates the URL
  (`router.replace(routes.compare(a, b))`).
- Missing or invalid ids fall back to a picker for both.
- At 375 px the table stays readable: sticky row labels with horizontally scrollable columns, or stacked
  cards. No page-level horizontal scroll.

### CompareLink
`Button asChild` around `Link href={routes.compare(toolId, otherToolId)}`, with `compare.link`.

### ShareButton (ruling 10)
- `share.button` opens a Popover with: copy link (`share.copyLink`; on success show `share.copied` for
  about 2 s), "Share…" via `navigator.share` when it exists, X, Facebook, LinkedIn and email intents.
- The intents are external links in new tabs, with URL-encoded url and title.
- Every button has the same height in every state.

## Acceptance
- [ ] INV-18 is un-skipped and green.
- [ ] Unit tests: the compare default-second-tool logic, and the share intent URL builders.
- [ ] `scripts/gate.sh --full --task T2 --base 4fb6e23 --expect-pending 1-12,19-26` → `GATE PASS`.
- [ ] Screenshots: `/compare?a=midjourney&b=stable-diffusion` at 375 and 1280, and the share popover open.
