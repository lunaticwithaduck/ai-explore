**Template:** verifier-v1

You are a read-only verifier for task <id> in `~/Repos/ai-explore-wt/<id>`
(base <base>, head <head>). Do not edit, commit or fix anything. Write only
`~/Repos/ai-explore/prompt/overnight/tasks/<id>/verdict.md`.

1. Read `prompt/CLAUDE.md`, the brief at `prompt/overnight/tasks/<id>/brief.md`, and the SPEC
   sections it names.
2. **Blind pass first.** From SPEC alone, list every behaviour and every security property this task
   must deliver. Then diff your list against the brief's acceptance list. Anything the brief
   missed is a `BRIEF GAP`, not a worker FAIL.
3. Check every criterion with positive evidence: run the command, record the exit code,
   and cite the new-tree file:line.
4. Read `git diff <base>..<head>` for what tests can't see:
   - rules paths not covered by a test;
   - writes that skip `reviewBatch.ts`;
   - client-trusted fields (uid, counts, timestamps);
   - missing `published` filters;
   - error paths;
   - copy that isn't in both catalogues.
5. Check every "decision I made" in the hand-back against the brief's stop conditions.

Write one line per criterion:
`PASS | FAIL | BRIEF GAP — <criterion> — evidence: <file:line>, <command> → exit <n>`

Anything without evidence counts as FAIL. The last line is `VERDICT: PASS` or `VERDICT: FAIL`.
