#!/usr/bin/env bash
set -uo pipefail

# Usage: scripts/gate.sh [--quick|--full] [--task <id> --base <sha>] [--expect-pending <list>] [--log <path>]
# Scope globs in scope.txt are matched with bash [[ $path == $glob ]]: '*' crosses '/'.

cd "$(dirname "$0")/.." || exit 2
[[ -f scripts/slot.sh ]] && source scripts/slot.sh

MODE=quick
TASK=""
BASE=""
EXPECT=""
LOG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick) MODE=quick ;;
    --full) MODE=full ;;
    --task) TASK="${2:-}"; shift ;;
    --base) BASE="${2:-}"; shift ;;
    --expect-pending) EXPECT="${2:-}"; shift ;;
    --log) LOG="${2:-}"; shift ;;
    *) echo "gate: unknown option $1" >&2; exit 2 ;;
  esac
  shift
done

if [[ -n "$TASK" && -z "$BASE" ]]; then echo "gate: --task needs --base" >&2; exit 2; fi

MAIN="$(git worktree list --porcelain | awk 'NR==1 {sub(/^worktree /, ""); print; exit}')"
TASK_DIR="$MAIN/prompt/overnight/tasks/$TASK"
if [[ -z "$LOG" ]]; then
  if [[ -n "$TASK" ]]; then LOG="$TASK_DIR/gates.log"; else LOG="./gates.log"; fi
fi
mkdir -p "$(dirname "$LOG")"
: > "$LOG"

FAILED=()

finish_step() {
  local name="$1" code="$2" started="$3"
  local line="STEP $name → exit $code ($((SECONDS - started))s)"
  echo "$line" >> "$LOG"
  echo "$line"
  [[ "$code" -ne 0 ]] && FAILED+=("$name")
  return 0
}

run_step() {
  local name="$1"; shift
  local started=$SECONDS
  echo "--- $name: $*" >> "$LOG"
  "$@" >> "$LOG" 2>&1
  finish_step "$name" $? "$started"
}

expand_list() {
  local item lo hi n
  for item in $(tr ',' ' ' <<< "$1"); do
    item="${item//–/-}"
    if [[ "$item" == *-* ]]; then
      lo="${item%-*}"; hi="${item#*-}"
      for ((n = lo; n <= hi; n++)); do echo "$n"; done
    elif [[ -n "$item" ]]; then
      echo "$item"
    fi
  done | sort -n -u
}

step_scope() {
  local scope_file="$TASK_DIR/scope.txt" bad=0 p glob ok globs=()
  if [[ ! -f "$scope_file" ]]; then echo "no scope file $scope_file" >> "$LOG"; return 1; fi
  while IFS= read -r glob; do
    glob="${glob#"${glob%%[![:space:]]*}"}"; glob="${glob%"${glob##*[![:space:]]}"}"
    [[ -z "$glob" || "$glob" == \#* ]] && continue
    globs+=("$glob")
  done < "$scope_file"
  while IFS= read -r p; do
    [[ -z "$p" ]] && continue
    ok=0
    for glob in "${globs[@]}"; do
      # shellcheck disable=SC2053
      if [[ $p == $glob ]]; then ok=1; break; fi
    done
    if [[ $ok -eq 0 ]]; then echo "out of scope: $p" >> "$LOG"; bad=1; fi
  done < <(git diff --name-only "$BASE..HEAD")
  return $bad
}

owned_invariants() {
  local cell
  cell="$(awk -F'|' -v id="$TASK" '{gsub(/^[ \t]+|[ \t]+$/, "", $2)} $2 == id {print $8; exit}' "$MAIN/prompt/overnight/ledger.md")"
  cell="${cell//–/-}"; cell="${cell//—/ }"
  expand_list "${cell//[ ,]/,}"
}

strip_markers() { sed -E 's/\.(skip|fixme|todo)\(/(/g'; }

step_oracle() {
  case "$TASK" in O1|O2|C1|C2|C3|F1|F2|F3|F4|L1) echo "exempt task $TASK" >> "$LOG"; return 0 ;; esac
  local bad=0 f diff removed added owned n pairs i r a line
  owned="$(owned_invariants)"
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    case "$f" in
      firebase/tests/*|app/e2e/*) ;;
      *.test.ts|*.test.tsx) git diff -U0 "$BASE..HEAD" -- "$f" | grep -qE '^[-+].*INV-' || continue ;;
      *) continue ;;
    esac
    git cat-file -e "$BASE:$f" 2>/dev/null || continue
    diff="$(git diff -U0 "$BASE..HEAD" -- "$f")"
    removed="$(grep -E '^-' <<< "$diff" | grep -vE '^---' | sed -E 's/^-//')"
    added="$(grep -E '^\+' <<< "$diff" | grep -vE '^\+\+\+' | sed -E 's/^\+//')"
    if [[ "$(strip_markers <<< "$removed")" != "$(strip_markers <<< "$added")" ]]; then
      echo "oracle changed beyond markers: $f" >> "$LOG"; bad=1; continue
    fi
    rem_lines=()
    add_lines=()
    while IFS= read -r line; do rem_lines+=("$line"); done <<< "$removed"
    while IFS= read -r line; do add_lines+=("$line"); done <<< "$added"
    for i in "${!rem_lines[@]}"; do
      r="${rem_lines[$i]}"; a="${add_lines[$i]:-}"
      [[ "$r" == "$a" ]] && continue
      if [[ "$r" =~ \.(skip|fixme|todo)\( && ! "$a" =~ \.(skip|fixme|todo)\( ]]; then
        n="$(grep -oE 'INV-[0-9]+' <<< "$r" | head -1 | sed 's/INV-//')"
        if [[ -n "$n" ]] && ! grep -qx "$n" <<< "$owned"; then
          echo "unmarked INV-$n in $f is not owned by $TASK" >> "$LOG"; bad=1
        fi
      fi
    done
  done < <(git diff --name-only "$BASE..HEAD")
  return $bad
}

pending_numbers() {
  local dirs=() d
  for d in firebase app packages scripts; do [[ -d "$d" ]] && dirs+=("$d"); done
  grep -rhoE --exclude-dir=node_modules --exclude-dir=.next \
    "(it|test|describe)(\.only)?\.(skip|fixme|todo)\(\s*['\"\`]INV-[0-9]+" "${dirs[@]}" 2>/dev/null \
    | grep -oE '[0-9]+$' | sort -n -u
}

step_pending() {
  local found expected
  found="$(pending_numbers)"
  echo "pending: $(tr '\n' ' ' <<< "$found")" >> "$LOG"
  echo "pending: $(tr '\n' ' ' <<< "$found")"
  [[ -z "$EXPECT" ]] && return 0
  expected="$(expand_list "$EXPECT")"
  if [[ "$found" != "$expected" ]]; then
    echo "pending mismatch; expected: $(tr '\n' ' ' <<< "$expected")" >> "$LOG"
    return 1
  fi
}

run_fn_step() {
  local name="$1" started=$SECONDS
  echo "--- $name" >> "$LOG"
  "step_$name"
  finish_step "$name" $? "$started"
}

run_step biome pnpm exec biome check .
run_step conventions node scripts/lint-conventions.cjs
run_step node-tests bash -c 'node --test scripts/*.test.cjs'
run_step typecheck pnpm typecheck
run_step test pnpm test
if [[ "$MODE" == full ]]; then
  run_step rules scripts/test-rules.sh
  run_step e2e scripts/test-e2e.sh
fi
if [[ -n "$TASK" ]]; then
  run_fn_step scope
  run_fn_step oracle
fi
run_fn_step pending

if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "GATE PASS"
else
  echo "GATE FAIL ($(IFS=,; echo "${FAILED[*]}"))"
  exit 1
fi
