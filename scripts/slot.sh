#!/usr/bin/env bash
# Sourced by the other scripts: derives every port from SLOT (0 = trunk, 1-4 = task worktrees).
SLOT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -z "${SLOT:-}" && -f "$SLOT_ROOT/.env.slot" ]]; then
  SLOT="$(sed -n 's/^SLOT=//p' "$SLOT_ROOT/.env.slot")"
fi
export SLOT="${SLOT:-0}"
export APP_PORT=$((3000 + SLOT))
export FIRESTORE_PORT=$((8080 + SLOT * 10))
export FIRESTORE_WS_PORT=$((9150 + SLOT * 10))
export AUTH_PORT=$((9099 + SLOT * 10))
export HUB_PORT=$((4400 + SLOT * 10))
export LOGGING_PORT=$((4500 + SLOT * 10))
export FIREBASE_PROJECT=demo-ai-explore
export FIREBASE_SLOT_CONFIG="$SLOT_ROOT/.firebase.slot.json"
export NEXT_PUBLIC_USE_EMULATORS=true
export NEXT_PUBLIC_EMULATOR_HOST=127.0.0.1
export NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT="$FIRESTORE_PORT"
export NEXT_PUBLIC_AUTH_EMULATOR_PORT="$AUTH_PORT"
export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:$APP_PORT"

node -e '
const fs = require("node:fs");
const [root, out] = process.argv.slice(1);
const config = JSON.parse(fs.readFileSync(`${root}/firebase.json`, "utf8"));
const e = config.emulators;
e.firestore.port = Number(process.env.FIRESTORE_PORT);
e.firestore.websocketPort = Number(process.env.FIRESTORE_WS_PORT);
e.auth.port = Number(process.env.AUTH_PORT);
e.hub.port = Number(process.env.HUB_PORT);
e.logging.port = Number(process.env.LOGGING_PORT);
fs.writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`);
' "$SLOT_ROOT" "$FIREBASE_SLOT_CONFIG"
