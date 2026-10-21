# INV-24 [mobile] flake: first final gate run, 2026-10-21 ~03:57

Playwright's test-results folder was overwritten by the next gate run, so this keeps the excerpt the manager captured from `gates.log`:

```
✘ 6 [mobile] › e2e/inv-24-admin.spec.ts:9:1 › INV-24: an admin publishes a tool and a non-admin sees the 403 view (30.1s)
  Error: locator.click: Test timeout of 30000ms exceeded.
    - waiting for getByTestId('shell-user-menu')
      - locator resolved to <button … aria-haspopup="menu" aria-expanded="false" data-testid="shell-user-menu" …>
      54 × waiting for element to be visible, enabled and stable
  > 40 |   await menu.click();        (app/e2e/fixtures/auth.ts, signOut helper)
```

- **Context:** the admin creates and publishes a tool, the spec navigates to the library, and then the signOut helper clicks the user menu.
- **Recurrence:** `--repeat-each 5` right afterwards passed 10/10, and the second full gate passed 20/20.
- **Suspects:**
  - the M4 "saving…" state, which waits for pending writes, keeps the menu trigger disabled while the admin's write
    queue drains under load;
  - or a header re-render keeps the trigger "unstable".
- **Next step:** reproduce with `--repeat-each 30` under parallel load, and log the trigger's `disabled` state.
