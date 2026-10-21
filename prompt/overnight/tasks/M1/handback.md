
## Round 2

**Head sha:** 14fec7b (merge of overnight/trunk 9dd7596 in e87456a, then the fix commit)

- Merged `overnight/trunk` cleanly. `test.fixme` → `test` kept in INV-24 and INV-22.
- Added `SavedNotice` (`features/admin/components/SavedNotice`) carrying `TEST_IDS.admin.saved`. It renders only when the save mutation has resolved successfully (`isSuccess`), i.e. after the lite-client commit is acknowledged. Copy `admin.form.saved` (en + bg).
- Tool, bundle and update forms no longer redirect after save. They stay on the page and show the status. Save is disabled while submitting. The lite client is kept.
- INV-22 + INV-24: 3 runs, 4 passed each (mobile and desktop).
- `scripts/gate.sh --full --task M1 --base 9dd7596 --expect-pending 20-21,25`: biome, conventions, typecheck, test, rules, e2e, pending all exit 0. scope and oracle exit 1. This is a base artifact: M1 branches from overnight/A1, not trunk, so a diff against the trunk sha (or 60e02c9 after the merge) lists A1's and trunk's files and INV-23's spec as out of scope or not owned. M1's own commits (`git diff 893a4cd 14fec7b --no-merges`) touch only admin/bundle-interest files and the admin messages. Re-run scope and oracle after A1 lands on trunk.
