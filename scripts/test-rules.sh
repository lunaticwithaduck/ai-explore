#!/usr/bin/env bash
set -euo pipefail
exec "$(dirname "$0")/emulators-exec.sh" "pnpm --filter @ai-explore/firebase test:rules"
