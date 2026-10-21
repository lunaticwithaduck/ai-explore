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
- A1 verifier · useEnsureProfile does not retry a failed profile creation in-session; useLocaleSwitch write before profile exists fails quietly
- A1 verifier · brief lesson: any redirect sanitiser criterion must list normalisation payloads (dot segments, encodings, backslashes)
- V1 · header rating in ToolHeader is server-rendered and trails the live summary until the next request
- V1 · reviews list reads the whole subcollection (no pagination)
- V1 verifier · reviewAuthor.ts:20 clips names by code points; rules count UTF-16 units → use .slice(0, 60) (queued into H1)
- V1 verifier · tool header (T1) shows the server-read average next to the live summary; they disagree until reload
- V1 verifier · composer keeps its skeleton if the reviews query fails
- U3 · helpful votes the deleted user gave stay counted (no votes collection-group rule)
- U3 · users/{uid}/subscriptions cannot be deleted by clients (rules read-only)
- U3 · auth emulator does not enforce requires-recent-login; the step-4 reauth fallback is unit-tested only
- U3 · INV-20 flake: RatingSummary shows a latency-compensated local value before the batch commits, so navigating to the SSR library can show the old rating; show only server-confirmed aggregates (queued into Z2), and INV-20 should clean up its review if it fails mid-way (oracle hardening, manager)
- U3 verifier · a second tab opened during an in-flight account delete re-creates users/{uid} (auto-create should be limited to new accounts)
- Z2c · add routes.adminUpdate(toolId, updateId) to config/routes and use it (edit-update link is built inside the feature today); drop unused admin.updates.hint
- Z1 M5 · visitors download Firebase Auth + Firestore (~200 KB gzip) on every page; plan: lazy-load the auth listener and Firestore client behind a dynamic import so public pages ship without them until a user signs in or a client query is needed; deferred as too broad for the last hours of an unattended run
- Z3 · bundle and update create still use plain setDoc (only tool create is overwrite-safe); admin create uses the full SDK from features/admin rather than an api/endpoints writer
- R3 · rules accept a few https strings the client schema rejects (e.g. https://[) → a review can be hidden yet counted; align packages/schemas photo validation with the rule and fall back to initials on image error
- R3 · any https host is allowed for photos (tracker risk remains): allow-list or CSP img-src at deploy time
- R3 · reviewAuthor keeps an ignored _fallbackName parameter until useReviewAuthor is cleaned up
- R3 · bylines stay stale after a rename by design; updateReview could rewrite them (rules already allow)
- R3 · any pre-existing profile with a non-https photo would block its later updates (none in demo/seed)
- W1 · INV-24 [mobile] flaked once in the final gate: signOut helper waited 30 s for shell-user-menu to become visible/enabled/stable after the admin create → library navigation; 10/10 passed on immediate repeat; error context saved in artifacts/qa/flake-inv24-mobile.md (suspects: header re-render or the M4 sign-out "saving…" state under load)
