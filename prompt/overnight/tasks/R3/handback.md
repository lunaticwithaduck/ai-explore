# R3 hand-back · round 1: STOPPED (oracle conflict)

**Head sha:** d95d057 (= base; no commits, worktree `overnight/R3` clean) · **Gate:** not run, nothing to gate

I stopped at the brief's own stop condition: "If an existing oracle test now conflicts, for example it seeds a
review without a profile, **stop and report**". It does. Under any rule that checks the author profile on
review **create**, 7 to 10 existing INV tests fail. I made no edits to tests, rules or app code. Every probe
below ran on slot 1 and was then reverted with `git checkout`.

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| Baseline rules suite green | — | `scripts/test-rules.sh` (unchanged rules) | 0: 16 files, 146/146 |
| Rule as briefed (create **and** edit must match profile, profile photo https) | `firebase/firestore.rules` (probe) | `scripts/test-rules.sh` | 1: **10 failed**, 136 passed |
| Variant (create must match; edit: author fields unchanged **or** match profile) | probe | `scripts/test-rules.sh` | 1: **7 failed**, 139 passed |
| Profile `photoUrl` https rule only (`^https://[^\\s]+$`, ≤ 2048) | probe | `scripts/test-rules.sh` | 0: 146/146 |
| `scripts/gate.sh --full --task R3 --base d95d057` | — | not run | — |

### Conflicting oracle tests (rule as briefed)
INV-5, `inv-05-review-create.test.ts`: create as ALICE with **no `users/alice` doc seeded**:
- allows the review and the matching aggregate change in one batch
- allows the lowest rating, an empty body and a null photo
- allows a body of exactly the maximum length and a bg locale

INV-6, `inv-06-review-edit-delete.test.ts`: edits a `reviewDoc` seed (`User alice`, photo `null`) with no profile:
- allows raising one's own rating with sum moved by r2 − r1
- allows lowering one's own rating with a negative sum delta
- allows editing only the body without touching the tool

INV-7, `inv-07-rating-interleaved.test.ts`: only the tool is seeded, and ALICE and BOB create reviews:
- allows several interleaved rounds and leaves sum and count equal to the reviews
- allows two concurrent create batches without losing either increment

INV-8, `inv-08-review-ownership.test.ts`: create as ALICE or BOB with no profile:
- allows a different user to add their own review to the same tool
- allows the same user to review a different tool

`builders.newReview` writes `authorName: "User <uid>"` and `authorPhotoUrl: "https://example.com/avatar.png"`.
`builders.reviewDoc` writes `authorName: "User <uid>"` and `authorPhotoUrl: null`. No review suite seeds `users/{uid}`.
INV-9, INV-1 (review groups) and R2 still pass: votes use the separate `isHelpfulCountUpdate` branch, and R2's review case is
a denial.

## Decisions I made that the brief didn't dictate
- I verified the conflict empirically instead of only reading the tests. The probe logs and diffs are at
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/r3-probe.log`,
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/r3-probe-variant.log`,
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/r3-probe-profile-only.log`,
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/r3-full-rules.diff` and
  `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/r3-variant-rules.diff`.
  They are temporary.
- I did not land the parts that don't conflict (the profile https rule, the `safePhotoUrl` fix, the client changes) on
  their own. The brief says stop, and half of M1 on trunk would change behaviour without closing the hole.

## Not done, and why
- All of goals 1–4: stopped on the oracle conflict above.

## For the manager

### 1. Oracle amendment needed (manager-owned, `firebase/tests/rules/`)
Any create-side profile check needs a `users/{uid}` profile seeded whose `displayName`/`photoUrl` equal the review's
author fields. The smallest amendment I see (not run, because I may not edit tests):
- `builders.ts`: add `authorProfileDoc(uid, photoUrl: string | null = 'https://example.com/avatar.png')`, which returns
  `profileDoc({ displayName: \`User ${uid}\`, photoUrl })`.
- INV-5 `beforeEach`: seed `paths.user(ALICE)`: `authorProfileDoc(ALICE)`. The "null photo" case also needs ALICE's
  profile seeded with `photoUrl: null` inside that test. Otherwise `newReview` would have to default to `null`.
- INV-6 `beforeEach`: seed `paths.user(ALICE)`: `authorProfileDoc(ALICE, null)` (matches `reviewDoc`).
- INV-7 and INV-8 `beforeEach`: seed `authorProfileDoc(ALICE)` and `authorProfileDoc(BOB)`.

### 2. Second blocker under the rule as briefed (outside R3 scope)
`app/src/features/reviews/utils/reviewBatch.ts` `updateReview` writes only `{ rating, body, updatedAt }`. With the
briefed **edit** check (`authorName == profile.displayName`), the stored byline must still equal the profile. So after
a user renames in Settings (`features/account/components/DisplayNameForm`), every edit of their existing review is
denied. The same happens to any review written before R3 with a fallback name (auth `displayName`, email prefix,
"anonymous"). Delete still works because it doesn't use `isValidReview`. There are two ways out:
- **(a) Recommended. Rules only, verified above (it clears all 3 INV-6 failures):**
  `isValidReviewCreate` requires `isProfileAuthor(...)`, and `isValidReviewEdit` adds
  `&& (unchanged(['authorName','authorPhotoUrl']) || isProfileAuthor(request.resource.data))`. The author fields still
  only ever come from a profile. No `reviewBatch.ts` change is needed, and the INV-6 suite needs no amendment.
- **(b)** Keep the strict edit check and put `reviewBatch.ts` (+ test) and its caller in scope, so that `updateReview`
  re-writes `authorName`/`authorPhotoUrl` from the current profile on every edit. That also refreshes stale bylines.

The probe's rule helpers, ready to reuse:
```
function isHttpsUrl(value) {
  return value == null
    || (value is string && value.size() <= 2048 && value.matches('^https://[^\\s]+$'));
}
function isProfileAuthor(review) {
  let profile = get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
  return review.authorName == profile.displayName
    && review.authorPhotoUrl == profile.photoUrl;
}
```
Also: `isValidProfile` uses `isHttpsUrl(profile.photoUrl)` in place of `isUrlText`. A missing profile makes `get()` error,
and the error denies, which gives "a review without a profile is denied".

### 3. Findings for the re-dispatch (goal 4 and client)
- **`profileSeed.safePhotoUrl` violates the new profile rule.** It accepts `http:`
  (`app/src/features/auth/utils/profileSeed.ts:14`). It also returns the original string, so a URL that `new URL()`
  tolerates but that contains whitespace, or that has an upper-case scheme, would fail `^https://[^\s]+$`. Then
  `ensureProfile` would be denied, the user would have no profile, and they could not review. The fix is one line: mirror
  the rule, `/^https:\/\/\S+$/.test(photoUrl) && photoUrl.length <= PHOTO_URL_MAX_LENGTH ? photoUrl : null`. The test
  title in `profileSeed.test.ts:20` says "keeps http(s)" but asserts no http case, so add `http://…` → `null`.
- **The other profile writers already satisfy the https rule:**
  - `SignUpForm` writes `photoUrl: null`.
  - `DisplayNameForm` patches only `displayName`.
  - No settings flow writes `photoUrl`.
  - The seed member profile has `photoUrl: null`.
- **`reviewAuthor.ts` needs rewriting.** Today it falls back from the profile to the auth `displayName`, then the email
  prefix, then "anonymous". It clips the name and validates the photo with `z.url()`, which accepts http. Under the new
  rule any fallback is a guaranteed deny. `useReviewAuthor` returns a non-null author while the profile is still `undefined`.
- **INV-20 is safe:** it signs up first (`SignUpForm` creates the profile), and it is the only e2e spec that submits a review.
- **Profiles that already exist:** a profile that already holds a non-https `photoUrl` would block **every** later
  update to that profile (locale switch, `notificationsSeenAt`, prefs), because `isValidProfile` checks the whole
  document. There is no such data in the demo or seed, but it matters if production data predates R3.

---

# R3 hand-back · round 2

**Head sha:** f2caec3 (on trunk a01130a) · **Gate:** `scripts/gate.sh --full --task R3 --base a01130a` → `GATE PASS`, pending list empty

Commits:
- eb8e951 `feat(firebase): reviews mirror the author's profile [R3]`
- f2caec3 `fix(reviews): single-flight review delete confirm [R3]` (release-audit m1, added by the coordinator)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| Creating a review requires `authorName`/`authorPhotoUrl` to equal the `users/{uid}` profile; no profile, no review | `firebase/firestore.rules:96-100,122` | `scripts/test-rules.sh` | 0: 17 files, 158/158 |
| An edit passes only if the author fields are unchanged or equal the current profile | `firebase/firestore.rules:129-132` | same | 0 |
| Profile `photoUrl` must be null or `^https://[^\s]+$` with at most 2048 characters, on create and update | `firebase/firestore.rules:46-49,163` | same | 0 |
| New rules tests (12) | `firebase/tests/rules/r3-review-author.test.ts` | same; against the **old** rules, all 6 deny tests fail and the 6 allow tests pass | 0 |
| `reviewAuthor` copies the profile exactly and returns null when there is no profile | `app/src/features/reviews/utils/reviewAuthor.ts:12-19` | `pnpm test` | 0 |
| The composer shows the existing skeleton while the profile loads, and a translated `form.profileMissing` (en + bg) when it is missing | `app/src/features/reviews/components/ReviewComposer/ReviewComposer.tsx` | `pnpm test` (ReviewsSection: +3 cases) | 0 |
| `safePhotoUrl` accepts only `^https://\S+$` with at most 2048 characters that also parses as a URL; `http`, upper-case scheme and whitespace become null | `app/src/features/auth/utils/profileSeed.ts:10-19` | `pnpm test` | 0 |
| m1: the delete confirm fires once per opening and is disabled after a click and while pending | `app/src/features/reviews/components/DeleteReviewDialog/DeleteReviewDialog.tsx` | `pnpm test`; 2 of the 3 new tests fail on the old dialog | 0 |
| INV-20 is green (mobile and desktop) | `app/e2e/inv-20-user.spec.ts` | gate e2e step: 20 passed | 0 |

## Decisions I made that the brief didn't dictate
- **`useReviewAuthor` is out of scope.** It isn't in `scope.txt`, and the gate's scope step enforces that list. It still calls
  `reviewAuthor(user, profile, fallbackName)`, so `reviewAuthor` keeps an ignored `_fallbackName?` third parameter to
  stay compatible. The hook now returns null while the profile is undefined or null, because `reviewAuthor` does.
- **An existing review stays editable without a profile.** A user with no profile still sees their own review and can
  edit or delete it. Only the create form is replaced by the message. The rules allow this because the edit leaves the
  author fields unchanged.
- **`safePhotoUrl` also requires the URL to parse** (it already did). Otherwise a value that matches the regex but is
  invalid, such as `https://[`, would pass the rule and then fail the profile `z.url()` schema, which would make the
  user's own profile disappear on the client.
- **The m1 test fakes the close animation.** The dialog test mocks `DialogClose` as a passthrough, so the dialog stays
  open after a click the way it does during the browser's close animation. In jsdom the content unmounts at once, which
  would hide the bug.

## Not done, and why
- No screenshots. The only visible change is the missing-profile notice, a dashed muted box styled like
  `ReviewSignInPrompt`, and the seeded flows don't reach it.

## For the manager (follow-ups)
1. **A rating can still be hidden while it counts (M1 is not fully closed).** The rules regex `^https://[^\s]+$`
   accepts values that `z.url()` rejects: `https://[`, `https://1.2.3.999`, `https://a:99999`, `https://?`. A user can
   put such a value in their own profile through the SDK, then post a review that copies it. The client drops that
   review, but it still counts in the average. Fix in `packages/schemas`: make `reviewSchema.authorPhotoUrl` (and the
   profile `photoUrl`) accept exactly what the rules accept, for example `z.string().regex(/^https:\/\/\S+$/).max(2048).nullable()`,
   and let the avatar fall back to initials when the image fails to load. Matching WHATWG URL parsing with a rules regex
   isn't practical.
2. **Any https host is still allowed,** so a user can still make visitors load a tracker image from their own profile
   photo. Z1 proposed an allow-list of hosts, or a CSP `img-src`. Deploy prep (H3) is the natural owner.
3. **Clean up the hook.** Drop the third argument in `features/reviews/hooks/useReviewAuthor.ts`, then
   `_fallbackName` in `reviewAuthor.ts`, and the `reviews.anonymous` key if nothing else uses it. This needs the hook in scope.
4. **Bylines go stale after a rename.** An edit keeps the old byline, by design of the edit rule. If fresh bylines
   are wanted, `reviewBatch.updateReview` can also write the current profile's `authorName`/`authorPhotoUrl`. The rules
   already allow that.
5. **Older profiles:** a profile that already holds a non-https `photoUrl` blocks every later profile update (locale,
   `notificationsSeenAt`, prefs). The demo and seed data have none. This only matters if production data predates R3.
