#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/slot.sh"
cd "$SLOT_ROOT"
exec "$(dirname "$0")/emulators-exec.sh" "scripts/seed.sh && pnpm --filter @ai-explore/app exec next dev -p $APP_PORT"
