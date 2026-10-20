# ai-explore

A library of AI tools, like the Steam / Epic library: Next.js on Firebase App Hosting, Firebase Auth +
Firestore, no Cloud Functions. Before changing anything, read in this order:

1. `prompt/CLAUDE.md`: the invariant rules. They apply to every change, every phase, every worker.
2. `prompt/SPEC.md`: the product spec; §Invariants are the acceptance tests.
3. `prompt/PLAN.md`: closed decisions, phases, lanes, gates.

The overnight autonomous build is `prompt/LOOP.md`. Its state lives in `prompt/overnight/`.
`reference/figma-make/` is the Figma Make prototype: a visual reference only, never imported.

The gate for every commit is `pnpm lint && pnpm typecheck && pnpm test` (husky). The full gate is
`scripts/gate.sh --full`.

Outside an active overnight run, the house session rules apply: run nothing slow and commit
nothing unless the owner says so for that run or commit.
