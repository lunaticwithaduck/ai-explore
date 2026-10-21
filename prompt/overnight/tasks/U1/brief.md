**Template:** brief-v1 · **Task:** U1 · **Phase:** 5 · **Model:** sonnet · **Base sha:** 60e02c9 (branched from overnight/A1, verification in progress)

# U1 — Saved tools, collections, and My Library

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/my-library/**`, `app/src/api/endpoints/myLibrary.ts`, `app/src/messages/{en,bg}/myLibrary.json`, `artifacts/screens/U1-*`.
Stubs you replace:
- `features/my-library/library/MyLibraryView.tsx` (`{ tools }`);
- the slots `SaveToolButton({ toolId })` (rendered on ToolCard and the tool page), `AddToCollectionMenu({ toolId })`
  (tool page), and `SidebarCollections()` (shell sidebar).

## Owns
The save and collection parts of INV-20 and the save step of INV-21. E5 un-fixmes both.

## Goal
- **Endpoints** (realtime): saved ids from `users/{uid}/saved`, and collections from `users/{uid}/collections`
  ordered by `order`. Mutations:
  - save and unsave: `{ savedAt: serverTimestamp() }`;
  - create a collection: name, icon from `COLLECTION_ICONS`, color from `ACCENTS`, `toolIds`, `order` = count,
    `createdAt: serverTimestamp()`;
  - rename, delete, add tool, remove tool (`arrayUnion` / `arrayRemove`, capped at 50).
  Write exactly the rule-allowed fields.
- **SaveToolButton:** an `IconButton` with `myLibrary.saveButton` and `aria-pressed`. Signed out, it goes to
  sign-in with `?next=`. Make it optimistic.
- **AddToCollectionMenu** (`myLibrary.addToCollection`):
  - a `DropdownMenu` of collections with check state (`myLibrary.addToCollectionItem`, `data-id`), toggling membership;
  - `myLibrary.newCollection` opens an inline Dialog with `myLibrary.collectionNameInput` and
    `myLibrary.collectionCreate`, which creates the collection **with this tool in it**.
  Hidden when signed out.
- **SidebarCollections:** a "Saved" link to `routes.myLibrary`, then each collection as
  `shell.sidebarCollection` with `data-id=<collectionId>`, its icon and accent colour, linking to
  `routes.myCollection(id)`. Render nothing when signed out.
- **MyLibraryView:**
  - tabs or segments for Saved and each collection, driven by `?collection=`;
  - a `myLibrary.grid` of `ToolCard` (from `@/features/catalogue/components/ToolCard/ToolCard`) for the
    selected set, from the `tools` prop;
  - a collection header with rename and delete (with confirm);
  - empty states with a link to browse.

## Acceptance
- [ ] Unit tests: collection name validation, and the 50-tool cap behaviour.
- [ ] `scripts/gate.sh --full --task U1 --base 60e02c9 --expect-pending 20-22,24-25` → `GATE PASS`.
- [ ] Screenshots: `/library` with one collection at 375 and 1280, and the add-to-collection menu open.
