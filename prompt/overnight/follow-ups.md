# Follow-ups

Found but out of scope, or deferred P2 work. Never done by the loop.

Format: `- <source task> · <what> · <why it matters>`
- 00:05 owner · H3 deploy prep (apphosting.yaml, DEPLOY.md, App Hosting monorepo check) · deferred because the owner is not hosting yet; README run instructions move to W1
- C2 · ISR / on-demand revalidation for public catalogue pages · they render per request in the MVP
- S1 · tutorial jEgVto5QME8 is titled "Tableau in Two Minutes" but runs 23 min; Runway tutorials oYNzl4Hzi4M and zfxZXBp9_50 are only 2–3 min · swap for better tutorials when curating
- S1 · prices and plans are sample data from the prototype · verify before launch
- O1 · account deletion cannot remove users/{uid}/subscriptions (no client writes, INV-4) · needs a trusted writer once payments exist
- R1 · admins may still write tools.rating freely (O1 contract), so an admin save carrying a stale rating could corrupt the aggregate; M1 never writes rating on edit, but the rules could also lock rating to the review path for everyone
- R1 · votes under a deleted review are orphaned (rules cannot delete them for the voter)
- R1 verifier · updates of draft tools are publicly readable (updates carry no published flag)
- R1 verifier · account deletion cannot find the user's helpful votes (no votes collection-group rule); their helpfulCount contributions remain
- R1 verifier · reviews (and rating updates) are allowed on unpublished tools
- review · crop wordmark logos (runway, elevenlabs, tableau-ai, jasper) to their icon marks so they read in the square ToolLogo tile · queued into H1
- E4 · Similar tools carousel cards are too narrow at 375 px (names wrap per letter) · queued into H1
- R2 · collection toolIds entries with hyphens may reach 127 chars (exact ≤64 per entry exceeds the rules expression budget at 50 entries)
- H1a · tap targets: filter chips and carousel arrows are 32 px, inline tool links on bundle/compare ~21–24 px; meets WCAG 2.2 AA minimum (24 px) mostly but below the 40 px comfort target
- H1a · moderate axe heading-order on library and /bundles (card h3 after h1); minor image-redundant-alt on compare
