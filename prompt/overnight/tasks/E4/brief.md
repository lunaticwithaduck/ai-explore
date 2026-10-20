**Template:** brief-v1 · **Task:** E4 · **Phase:** 4 · **Model:** sonnet · **Base sha:** 459484a

# E4 — Visitor journey end to end (INV-19)

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

Un-fixme `app/e2e/inv-19-visitor.spec.ts` and make it green on both projects by fixing the integration
seams in the lanes B1, T1 and T2. Those lanes are merged; their folders are in your scope for **fixes only**.
Do not restructure them.

The seams the manager named at spawn are listed below. Discover the rest by running the spec.

## Scope
`app/e2e/inv-19-visitor.spec.ts` (remove `fixme` only), `app/src/features/{library,tool,compare,share,catalogue}/**` (fixes only), `artifacts/screens/E4-*`.

## Acceptance
- [ ] INV-19 is green on mobile and desktop.
- [ ] `scripts/gate.sh --full --task E4 --base 459484a --expect-pending 20-25` → `GATE PASS`.
- [ ] Hand-back: list every seam fixed with file:line.
