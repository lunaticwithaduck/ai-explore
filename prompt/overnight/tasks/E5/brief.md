**Template:** brief-v1 · **Task:** E5 · **Phase:** 5 · **Model:** sonnet · **Base sha:** <set at spawn>

# E5 — Signed-in journeys end to end (INV-20, INV-21)

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

Un-fixme `app/e2e/inv-20-user.spec.ts` and `app/e2e/inv-21-notifications.spec.ts`, then make them green on
both projects by fixing the integration seams in the lanes A1, U1, V1 and N1. Those lanes are merged, and
their folders are in your scope for **fixes only**.

## Scope
- The two specs above (remove `fixme` only);
- `app/src/features/{my-library,reviews,notifications,auth}/**` and `app/src/shell/**` (fixes only);
- `artifacts/screens/E5-*`.

## Acceptance
- [ ] INV-20 and INV-21 are green on mobile and desktop.
- [ ] `scripts/gate.sh --full --task E5 --base <base> --expect-pending <given at spawn>` → `GATE PASS`.
- [ ] Hand-back: list every seam fixed with file:line.
