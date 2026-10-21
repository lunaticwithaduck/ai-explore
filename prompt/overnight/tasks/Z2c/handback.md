# Z2c hand-back · round 1

**Head sha:** bd536a9 (branch overnight/Z2c) · **Gate:** `scripts/gate.sh --full --task Z2c --base 267d8a0` -> GATE PASS, pending empty

## Items
| item | status | notes |
|---|---|---|
| M10 | fixed | Updates tab lists updates via collection group, newest first (sorted client-side, no index needed), with tool, version, kind, date, Edit. New edit page admin/updates/[toolId]/[updateId]; tool and version locked, patch writes kind/title/changes only. |
| M11 | fixed | Tutorials repeater, comparison fieldset, similar/complementary multi-selects, all in toolFormSchema. Create falls back bestUseCase to tagline when empty (INV-24 does not fill it). Patch never writes rating. |
| M12 | fixed | useFieldError + fieldErrorKey map zod issues to translated per-field messages; hints and placeholders; prices in dollars via utils/money.ts (unit tested), used for plans and bundles. en and bg. |
| m18 | fixed | Slug full-width row in tool and bundle forms. |
| m19 | fixed | Interest rows show bundle names with slug beneath; total labelled. |
| m20 | fixed | Edit links are size=sm secondary Buttons (32 px) in tools, bundles, updates. |

## Decisions
- Edit-update href is built in features/admin/utils/updateDocument.ts from routes.admin, because config/routes.ts is a contract I cannot edit. Follow-up: add routes.adminUpdate(toolId, updateId).
- Added api endpoints adminUpdates/adminUpdate and a mode arg on createUpdate in admin.ts (kept under 200 lines).
- Split ToolForm into ToolBasicsCard, ToolComparisonCard, ToolTutorialRows, ToolMultiSelect, MoneyInput.

## Not done
- Nothing skipped. No second batch received.

## For the manager
- Screenshots: artifacts/screens/Z2c-*.
- Unused key admin.updates.hint left in messages.
