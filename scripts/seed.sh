#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/slot.sh"
export FIRESTORE_EMULATOR_HOST="${FIRESTORE_EMULATOR_HOST:-127.0.0.1:$FIRESTORE_PORT}"
export FIREBASE_AUTH_EMULATOR_HOST="${FIREBASE_AUTH_EMULATOR_HOST:-127.0.0.1:$AUTH_PORT}"
export GCLOUD_PROJECT="$FIREBASE_PROJECT"
exec pnpm --filter @ai-explore/firebase seed
