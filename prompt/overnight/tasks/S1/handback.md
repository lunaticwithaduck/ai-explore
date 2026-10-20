# S1 hand-back · round 1

**Head sha:** 2af81bf · **Gate:** `scripts/gate.sh --full --task S1 --base 376cd00` → exit 0 (GATE PASS)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| seed idempotent | firebase/seed/seed.ts | `scripts/emulators-exec.sh "scripts/seed.sh && scripts/seed.sh"` | 0 |
| refuses without emulator env / wrong project | firebase/seed/seed.ts:13 | `pnpm exec tsx seed/seed.ts` | 1 |
| INV-14 checks (parse, ids, refs, fromPrice, >=4 unique tutorials, bg, checkout false, mj update <=7d, ratings = reviews, bundle savings > 0) | firebase/seed/validate.ts | ad-hoc tsx script, deleted afterwards | 0 |
| full gate | - | `scripts/gate.sh --full --task S1 --base 376cd00` | 0 |

## Decisions I made that the brief didn't dictate
- Update doc id is `v<version with dots as dashes>` (schema has no id) — deterministic so reseeding is idempotent.
- `daysAgo` truncates to UTC midnight — keeps timestamps stable within a day so reseeding writes identical data.
- Updates versions are numeric only (schema regex); prototype's "GPT-4 Turbo", "Gen-3", "SDXL 1.0" replaced by 4.1, 3.0, 3.5. Update contents are sample text.
- Comparison speed/quality rescaled from the prototype's 10-point scale to the schema's 1-5.
- ChatGPT plan features reworded (no model-version claims); Stable Diffusion DreamStudio is a `custom` plan with null price, so its tool has no `fromPriceCents`.
- Copilot developer is "GitHub" (prototype: "GitHub & OpenAI"); tool ids use the SEED slugs (`tableau-ai`, `runway`).
- Logo backgrounds: midjourney #7DD3FC, chatgpt #1A1A1A (white logo), runway #FFFFFF, tableau-ai #F8F9FA, jasper #FF8C42, elevenlabs #FDBA74, github-copilot #BFDBFE, stable-diffusion #FCD9A8.
- Legal Research Stack = chatgpt, jasper, tableau-ai. Bundle prices are my own, all below list price.
- Reviews: 13 across 7 tools, 14 distinct fake reviewer uids; jasper has none.
- Added `admins/e2e-admin` with `{createdAt}`; check this against rules if they require another shape.
- The seed also requires `FIREBASE_AUTH_EMULATOR_HOST`.

## Slots
- Filled: none
- Consumed while still stubbed: none

## Not done, and why
- Pricing was not researched (out of scope); it is sample data.
- Every tool has at least 4 verified tutorials; no stop condition hit. No durations are estimated (all from watch page lengthSeconds).
- Duplicated prototype ids that failed oEmbed (404) were dropped; kept: 3 ChatGPT, 4 Copilot, 2 Tableau, 2 Stable Diffusion.

## For the manager
- Note: jEgVto5QME8 is titled "Tableau in Two Minutes" but is 23 min long.
- Short videos: runway zfxZXBp9_50 (2 min), oYNzl4Hzi4M (3 min).

## Tutorials (all oEmbed 200)
- chatgpt: JTxsNm9IdYU → 200 (2044s) ChatGPT Tutorial - A Crash Course on Chat GPT for Beginners
- chatgpt: jC4v5AS4RIM → 200 (510s) Master the Perfect ChatGPT Prompt Formula (in just 8 minutes)!
- chatgpt: VznoKyh6AXs → 200 (1320s) How to learn to code FAST using ChatGPT (it's a game changer seriously)
- chatgpt: hTAsWGTK6wY → 200 (6641s) FULL ChatGPT Tutorial For Beginners in 2026! (FULL COURSE)
- elevenlabs: yDTbAxJ3sKI → 200 (657s) How to Use ElevenLabs AI (Complete Beginner Tutorial)
- elevenlabs: lVqg3Up_oLM → 200 (538s) Elevenlabs Tutorial for Beginners 2026 (Step-by-Step Guide)
- elevenlabs: QGSAvB45lNY → 200 (568s) ElevenLabs Tutorial: Full Demo of Features, Pricing, and Setup in 2025
- elevenlabs: Zozt9QfAwcg → 200 (1795s) The Only ElevenLabs Tutorial You'll Need (2026)
- github-copilot: hPVatUSvZq0 → 200 (435s) GitHub Copilot in 7 Minutes 👨‍💻🤖🚀
- github-copilot: 2nPoiUJpDaU → 200 (523s) GitHub Copilot in VSCode: Top 10 Features Explained
- github-copilot: 3surPGP7_4o → 200 (236s) GitHub Copilot: Getting Started with Chat
- github-copilot: CwAzIpc4AnA → 200 (2754s) Pragmatic techniques to get the most out of GitHub Copilot | BRK255H
- jasper: U5naGpqFcww → 200 (540s) Jasper AI Beginners Tutorial 2026 (COMPLETE STEP-BY-STEP)
- jasper: 7KbscTkFhDU → 200 (572s) How to Use Jasper AI for Beginners in 2025: Ultimate Tutorial
- jasper: Z_aZNoFBvLk → 200 (1625s) Jasper AI Tutorial for Beginners (2024) Full Guide
- jasper: Dp7pFsQrris → 200 (1512s) Jasper AI Tutorial For Beginners (2024)
- jasper: vs8l1xWwYqo → 200 (1642s) Jasper AI Tutorial 1 - Beginner Basics
- midjourney: aodE4be2t-g → 200 (2245s) FULL 2026 Midjourney AI Tutorial (for Beginners)
- midjourney: NKRvL63A--E → 200 (431s) MidJourney - EASY Beginner Guide to Get Started
- midjourney: Ziv-MtqMEr0 → 200 (640s) How to Get Started With Midjourney: 10-Minute Tutorial for Beginners
- midjourney: B1hOFU-Wzf8 → 200 (994s) Level Up Your Prompts in Midjourney V6! - Generate Better Ai Images
- midjourney: NM_pnGGdsac → 200 (1645s) 2025 Midjourney Full Guide - Beginner to Pro
- runway: FqYRkl12ON8 → 200 (1077s) Runway AI - Tutorial for Beginners in 17 MINUTES !  [ FULL GUIDE ]
- runway: oYNzl4Hzi4M → 200 (169s) Getting Started with Gen-3 Alpha | Runway Academy
- runway: d7oxhBrx4v8 → 200 (1076s) How To Use Runway Gen-3 Alpha - (Runway Gen-3 Tutorial) - Gen 3 Alpha Guide
- runway: zfxZXBp9_50 → 200 (94s) How to Use Runway Gen 3 Full Guide 2026
- stable-diffusion: B5VzYIc02RE → 200 (505s) How to use Stable Diffusion for Beginners
- stable-diffusion: xLn1LL5N5b0 → 200 (1160s) How To Install & Run Stable Diffusion for Dummies
- stable-diffusion: 3cvP7yJotUM → 200 (471s) Install Automatic 1111 WITH automated Updates - super easy #gitpull #stablediffusion
- stable-diffusion: 70H03cv57-o → 200 (1258s) ULTIMATE FREE LORA Training In Stable Diffusion! Less Than 7GB VRAM!
- stable-diffusion: dMkiOex_cKU → 200 (3642s) Stable Diffusion Crash Course for Beginners
- tableau-ai: X5Fl8_zjt0U → 200 (774s) Tableau Tutorial for Beginners | Create Your First Dashboard
- tableau-ai: jEgVto5QME8 → 200 (1382s) Tableau Basics for Beginners - Tableau in Two Minutes
- tableau-ai: yPmUOmg_FTs → 200 (1324s) The Only Tableau Tutorial You Need to Get Started
- tableau-ai: TKG1_6lw1_c → 200 (1446s) Build An Interactive Tableau Dashboard - Start to Finish
