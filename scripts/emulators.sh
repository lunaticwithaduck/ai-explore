#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/slot.sh"
cd "$SLOT_ROOT"
exec pnpm exec firebase emulators:start --config "$FIREBASE_SLOT_CONFIG" --project "$FIREBASE_PROJECT" --only firestore,auth "$@"
