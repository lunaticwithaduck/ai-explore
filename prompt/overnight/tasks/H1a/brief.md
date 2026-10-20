**Template:** brief-v1 · **Task:** H1a · **Phase:** 6 (pulled forward: public pages) · **Model:** sonnet · **Base sha:** 5411984

# H1a — Public pages polish: logos, mobile layout, accessibility, states

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

The public pages (library, tool, bundles, compare, share) are merged and their e2e passes (INV-19, INV-26).
Make them **look and behave production-ready** at 375 and 1280 without breaking any test. The signed-in
features are being built in parallel by other lanes; do not touch them.

## Scope
- `app/src/features/{library,tool,compare,share,bundles,catalogue,system}/**`;
- `app/public/logos/**`;
- `packages/ui/src/components/**` (fixes only, no API removals);
- `app/src/messages/{en,bg}/{library,tool,compare,share,bundles,system}.json`;
- `app/src/app/[locale]/error.tsx` and `app/src/app/[locale]/(public)/**/loading.tsx` (new route files: a thin render of a View or Skeleton);
- `artifacts/screens/H1a-*`.

## Work list
1. **Logos.** Wordmark logos are illegible in the square `ToolLogo` tile: runway, elevenlabs, tableau-ai and jasper
   (look at `artifacts/screens/B1-library-1280.png`). Crop each PNG in `app/public/logos/` to its **icon mark**
   with `sips` (`sips -c <h> <w> --cropOffset <y> <x> in --out out`, then `sips -Z 256`):
   - Runway: the "R" glyph;
   - ElevenLabs: the "II" mark;
   - Tableau: the "+" cross;
   - Jasper: the face icon.
   Inspect each source image (e.g. `sips -g pixelWidth -g pixelHeight`, and view it) to find the crop box.
   Keep the original colours, and keep `logo.background` working: these logos have light backgrounds. If a crop is
   impossible, increase the visible size by tightening the padding in `ToolLogo` for wide images instead.
2. **Mobile layout.** At 375 px the Similar tools carousel cards are too narrow and names wrap letter by letter. Give
   carousel slides a sensible minimum width (for example about 80% of the viewport on mobile). Check every public page at 375
   for horizontal overflow (`document.documentElement.scrollWidth === 375`), clipped text, and tap targets under 40 px.
3. **Accessibility.** Run `@axe-core/playwright` (it is installed) against the library, `/tools/midjourney`, `/bundles`,
   `/bundles/startup-founder-pack` and `/compare?a=midjourney&b=stable-diffusion`, in en and bg. Fix every serious or
   critical violation: contrast, names, landmarks, list semantics. INV-25 will later assert this across the app.
   Use a throwaway script outside the repo or a temporary spec you do not commit.
4. **States.**
   - Add a localized error boundary: `[locale]/error.tsx` rendering `features/system/error/ErrorView`, with a retry and a
     link home.
   - Add `loading.tsx` skeletons for the library and the tool page, using the `Skeleton` primitive.
   - Make sure every public list has an empty state, e.g. a bundle with no tools or a compare with too few tools.
5. **Polish pass** against the prototype's feel (`reference/figma-make/src/app/components/*`):
   - spacing rhythm and card hover states;
   - the tool page header actions row on mobile (Open first, then the icon actions);
   - the bundles section on the library.
   Keep it restrained. Do not redesign.

## Acceptance
- [ ] After your changes INV-19 and INV-26 still pass, along with smoke.
- [ ] No serious or critical axe violations on the five public pages in either locale. List any non-blocking ones you leave.
- [ ] No horizontal overflow at 375 on any public page.
- [ ] Before and after screenshots: `artifacts/screens/H1a-{library,tool,bundle,compare}-{375,1280}.png` (after), and you viewed them.
- [ ] `scripts/gate.sh --full --task H1a --base 5411984 --expect-pending 20-25` → `GATE PASS`.
