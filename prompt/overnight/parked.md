# Parked: needs the owner

Only for what needs the owner's authority (LOOP.md §7). The loop takes the recommended
option where it is reversible and keeps going.

Format:

```
## <id> · <time from date> · <one-line question>
Facts: …
A) … (recommended)
B) …
C) …
Loop did: <the option taken, or "blocked">
```

## Q1-m29 · 03:15 · Should an explicit /bg/... URL override a signed-in user's saved locale?
Facts: today a signed-in user with locale `en` who opens a shared `/bg/...` link is redirected to the English page (useProfileLocaleSync). SPEC §7 says the locale "persists and redirects".
A) Keep the redirect (SPEC as written) and show a small notice offering to switch (recommended: least surprising for the account owner)
B) Honour the URL locale for that visit, and offer to update the saved preference
C) Honour the URL locale and silently update the preference
Loop did: kept current behaviour (A without the notice); no change made.

## Q1-m30 · 03:15 · Bulgarian letterforms (Inter `locl`)
Facts: with `lang="bg"`, Inter switches to Bulgarian-style Cyrillic forms (д, т, etc.), which looks like a different font. It is the typographically correct Bulgarian style.
A) Keep it (recommended: correct for Bulgarian readers)
B) Disable it with `font-feature-settings: "locl" 0` on `:lang(bg)`
Loop did: kept it.
