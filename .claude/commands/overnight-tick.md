---
description: Overnight loop heartbeat. Recovers stalls, advances the queue, or starts wrap-up. Idempotent.
---

Heartbeat for the overnight run in `prompt/LOOP.md`. Be brief and do only this, in order:

1. Run `date`. If `prompt/overnight/ledger.md` has no recorded owner grant, reply
   "overnight run not started" and stop.
2. If the ledger is closed or the time is past T+8:00, delete the heartbeat cron (CronDelete) and stop.
3. If `prompt/overnight/STOP` exists, or the time is at or past T+7:35 and wrap-up has not
   started, start wrap-up (LOOP.md §8–§9).
4. For each ledger row in `working`, `gate` or `verifying`:
   - If its agent has finished and nothing has acted on that, act on it (LOOP.md §6.5–§6.7).
   - If its agent transcript's mtime (`stat`, never read it) is more than 20 minutes old, stop
     the agent and resume per LOOP.md §6.9.
5. If fewer than 4 tasks are in flight and the time is before T+7:15, pick per LOOP.md §6.1.
6. If anything changed, append one Events line to the ledger. If nothing changed, end with
   "tick: no change" and write nothing.

If a worker is in flight and healthy, do not touch it.
