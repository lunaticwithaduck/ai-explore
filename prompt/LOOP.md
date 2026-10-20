# Overnight build loop (autonomous, 8 hours)

One Opus manager session takes `ai-explore` from an empty repo to the SPEC's MVP in 8
hours, running PLAN.md's phases with parallel workers in git worktrees. It descends from
the majstorbg rebuild loop (`../majstorbg-estate/audits/2026-09-30-rebuild-loop.md`) and
keeps its discipline: everything on disk, a gate script, bounded retries, parking, a kill
switch and a handoff. It drops what cost that loop nine hours before any product code
existed: no parity harness, no auditor session, no seeded defects. Verifiers run only
on security-critical tasks.

**After any compaction or clear:** re-read this file, `prompt/overnight/ledger.md` and the
newest `handback.md`/`verdict.md` before acting.

---

## 1. Owner grant

The kickoff message activates this. The manager copies the owner's words verbatim into the
ledger with `date` output. The grant expires when the ledger closes or at T+8:00, whichever
comes first.

For this run only, it overrides the house session rules "run nothing slow" and "never
commit unless told". Inside `~/Repos/ai-explore`, the manager and its workers **may**:
- install the PLAN §0 dependencies (Phase 1 only), emulator JARs and Playwright browsers;
- run lint, typecheck, tests, builds, dev servers and the Firebase emulators;
- create branches `overnight/*`, worktrees under `~/Repos/ai-explore-wt/`, and commits;
- squash-merge verified task branches into `overnight/trunk`;
- make the single initial commit of the plan on `main`;
- decide product, copy and scope questions inside SPEC, logging each with its reason (§7);
- use WebFetch / WebSearch for public docs (Firebase, Next.js, next-intl, Radix) and
  YouTube oEmbed checks.

## 2. Boundaries: the loop never

- pushes, adds a remote, opens a PR, or touches `main` after the initial commit;
- runs `firebase deploy`, `firebase login`, `firebase projects:*`, `gcloud`, or anything that
  creates, reads or points at a real Firebase or Google Cloud project. The project id is
  `demo-ai-explore`, and emulators only;
- writes outside `~/Repos/ai-explore` and `~/Repos/ai-explore-wt/` (other repos are read-only references);
- creates or stores credentials, API keys or real `.env` values;
- uses `--no-verify`, force operations, `git reset --hard` or a rebase on `overnight/trunk`,
  or `git add -A` / `git add .`;
- changes `.claude/` settings, hooks, or permission config;
- adds a dependency outside PLAN §0;
- works around a permission prompt or a classifier block. The blocked task stops, the exact
  message goes to `parked.md`, the owner gets a PushNotification, and other work continues.

The kill switch: if `prompt/overnight/STOP` exists, the loop halts at the next step and
writes the handoff.

## 3. Roles and models

| Role | Model | Does |
|---|---|---|
| Manager (this session) | Opus 5.5 | Foundation and contracts (F1–F4, C1–C3) and wrap-up (W1). Writes every brief and `scope.txt`. Runs gates, merges, keeps the ledger, decides. **Writes no feature code after Phase 2.** |
| Worker | per ledger row (Sonnet 5.5 default, Opus 5.5 for O1, R1, D1, A1, V1, U3, escalations) | One task, in its own worktree, tests first, then commits and writes a hand-back. Oracle workers (O1, O2) never implement the tasks their tests judge |
| Verifier | Opus 5.5, read-only | Only for R1, A1, V1 and U3, or any task the manager flags. Fresh each time. Writes `verdict.md` |

There is at most one agent layer between the owner and the code: no intermediate managers.
At most 4 workers run at once.

## 4. State on disk

```
prompt/overnight/
  ledger.md                 grant, run clock, worktrees, task table, decisions, events
  parked.md                 owner decisions: question, facts, options A/B/C, recommended one marked
  follow-ups.md             found but out of scope, or deferred P2 work
  STOP                      kill switch (absent while running)
  HANDOFF.md                written at wrap-up (§9)
  templates/{brief,handback,verifier}.md
  tasks/<id>/{brief.md,scope.txt,handback.md,gates.log,verdict.md}
artifacts/screens/, artifacts/qa/
```

Timestamps always come from `date`, never from estimates. The ledger and task files are
committed on trunk at each phase gate and at wrap-up. They are not committed per event,
because every commit pays the husky gate.

## 5. Branches, worktrees, slots

- `main` gets one commit, the plan. `overnight/trunk` branches from it, and the main
  checkout `~/Repos/ai-explore` stays on trunk for the whole run.
- Task `X` runs in `git worktree add ~/Repos/ai-explore-wt/X -b overnight/X overnight/trunk`.
  The manager writes `SLOT=<1–4>` to `.env.slot` in that worktree and runs
  `pnpm install --offline --frozen-lockfile` there. Trunk is SLOT 0. A worktree is removed
  after its merge, and the branch is kept.
- All dev-server and emulator ports derive from SLOT (`scripts/slot.sh`), so four
  workers and trunk can run emulators side by side.

## 6. Per task

1. **Pick.** Choose ledger rows that are `queued`, whose phase is open and whose dependencies are `merged`. P1 before P2. At most 4 in flight, with pairwise-disjoint `scope.txt`.
2. **Brief.** Fill `templates/brief.md` into `tasks/<id>/brief.md` and write `scope.txt` as globs. A brief is fully decided: SPEC sections, the INV numbers owned, exemplar paths, the slot components the task fills or consumes, out of scope, and stop conditions. Workers do not re-investigate what the brief already settles.
3. **Spawn.** Use the Agent tool, in the background, with the model from the ledger. The prompt is one line: `Read ~/Repos/ai-explore/prompt/overnight/tasks/<id>/brief.md and do it.` Do not use Agent worktree isolation; the manager already made the worktree. Set the status to `working` and record `base`.
4. **Work (worker).**
   - Take the `fixme` off its INV tests (never edit their assertions).
   - Implement inside scope.
   - Run `scripts/gate.sh --quick` until green.
   - Commit with named files and a conventional message.
   - Write `handback.md` (template), which includes **"decisions I made that the brief didn't dictate"**.
5. **Gate (manager).** In the worktree, run `scripts/gate.sh --full --task <id> --base <base> 2>&1 | tail -40`. The full log goes to `tasks/<id>/gates.log`.
   - **Red:** send the failing lines back to the same worker with SendMessage. This counts as a round.
   - **Never message a worker that is still running.** Never put two writers in one worktree.
6. **Verify.** Only for flagged tasks. Spawn a fresh Opus verifier with `templates/verifier.md`.
   - A PASS needs file:line, the command, and its exit code. Anything without evidence counts as FAIL.
   - A FAIL goes back to the worker as a round. The worker may contest it with evidence, and the manager rules.
7. **Merge.** This step is serial.
   - If trunk moved since `base`, the worker merges trunk into its branch and the gate re-runs.
   - Then, on trunk: `git merge --squash overnight/<id>` and commit `type(scope): <title> [<id>]`, with a why-body and the attribution line. Husky re-checks.
   - Remove the worktree and update the ledger with head, verdict and LOC Δ.
   - **Trunk must stay green.** Nothing merges onto a red trunk. A red trunk becomes the next task, which the manager fixes or briefs.
8. **Retry and park.**
   - At most 2 worker rounds. Then the manager rewrites or splits the brief, and one Opus escalation round follows. After that, `parked`.
   - The ledger records the fail cause: `brief gap | worker miss | verifier false FAIL | flaky gate | environment`. Two of the same cause in one phase means the template is fixed before the next brief.
9. **Time box.** 75 minutes from spawn to merge.
   - A worker whose transcript file has not changed (check its mtime with `stat`; never read it) for 20 minutes is stopped with TaskStop.
   - A fresh worker then resumes from the branch head and the last hand-back. This counts as a round.

## 7. Decisions

The manager decides every product, copy, ordering and scope question inside SPEC itself,
and writes it in the ledger's Decisions section with one line of reasoning. The loop does
not wait on the owner.

`parked.md` is only for what needs the owner's authority: money, accounts or credentials,
removing SPEC scope, or anything outside the grant. The loop picks the recommended option
where it is reversible and keeps going.

PushNotification is sent only for:
- a permission or classifier block;
- the Phase 1 gate (as a proof that notifications work);
- the handoff being ready.

## 8. Clock, heartbeat, stop conditions

- **T** is the first `date` the manager records. Phase boxes are in PLAN.md.
- **Heartbeat.** At kickoff the manager creates a session cron (CronCreate, `7,37 * * * *`)
  that runs `/overnight-tick`. Agent completion notifications drive the loop; the tick only
  recovers stalls. The tick is idempotent (`.claude/commands/overnight-tick.md`). If
  CronCreate is unavailable, the owner runs `/loop 30m /overnight-tick`.
- **T+7:15:** no new tasks are picked.
- **T+7:35:** in-flight work that has not merged is stopped and left on its branch, and recorded under §9 held work. Wrap-up starts.
- **T+8:00:** hard stop.
- **Thrash guard.**
  - Three consecutive gate failures with cause `environment` stop new picks until a repair task fixes the environment.
  - A phase whose P1 tasks are all parked closes as failed. The next phase opens only if its dependencies are met; otherwise wrap-up starts early.
- **Context.** Slow output is piped through `tail`/`grep`. The manager never reads worker transcripts, and never re-reads a file it just wrote.

## 9. Handoff (`prompt/overnight/HANDOFF.md`)

| § | Contents |
|---|---|
| 0 | State in one paragraph: what works, what doesn't, invariants green x/26 |
| 1 | How to run and review it: exact commands (`pnpm i`, `pnpm emulators`, `pnpm seed`, `pnpm dev`, URLs, the admin test login on the emulator) |
| 2 | Where everything is: branches, worktrees left, ledger, screenshots |
| 3 | What was built, route by route, with screenshot paths |
| 4 | Bugs found but not fixed |
| 5 | Open decisions for the owner (from `parked.md`), each with its recommendation |
| 6 | Held or unmerged work, and why |
| 7 | Decisions the loop made under the grant |
| 8 | Guardrails, confirmed: no push, no deploy, no real project, no secrets, nothing outside the repo |
| 9 | Numbers: tasks merged, parked and failed; tests by kind; LOC; wall-clock per phase |
| 10 | Owner's next steps to launch (Firebase project on Blaze, App Hosting backend, rules and indexes deploy, first admin, verified catalogue facts, payment provider) and process notes for the next loop |

## 10. Preflight and start (owner, about 15 minutes before leaving)

1. Plug in the Mac and keep the lid open. In a separate terminal:
   `caffeinate -dimsu -t 30600` (8.5 h).
2. `cd ~/Repos/ai-explore && claude` (Opus 5.5, auto mode as usual).
3. Paste the kickoff below.
4. **Stay through Phase 1 (about 45 minutes).** It does every network install, emulator download
   and Playwright browser check. That is where permission prompts and classifier blocks
   surface. Leave after the Phase 1 gate notification arrives.

**Kickoff** (paste as is):

```
Overnight run. Read prompt/LOOP.md first, then prompt/CLAUDE.md, prompt/SPEC.md,
prompt/PLAN.md and prompt/overnight/ledger.md. You are the manager.

I grant LOOP.md §1 as written, within the boundaries of §2, for this run only.
I won't be around to give OKs after Phase 1. Record this grant verbatim in the
ledger with the current `date`, create the heartbeat, and start Phase 1 now.
The deadline is 8 hours from the first time you record.
```

**In the morning:** read `prompt/overnight/HANDOFF.md`. The code is on `overnight/trunk`;
merge it into `main` yourself once you've reviewed it.

## 11. Lessons carried over from the rebuild loop

- Product code first. Foundation and contracts are capped at 1:30 together.
- One verification round is the default; extra rounds are earned by a FAIL.
- Use `date` for every timestamp.
- Never resume a worker that might still be running.
- Keep loop tooling in `scripts/`, not in a scratchpad that dies with the session.
- Classifier blocks are reported, not routed around.
