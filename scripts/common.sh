#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"
BACKEND_PID_FILE="$RUN_DIR/backend.pid"
FRONTEND_PID_FILE="$RUN_DIR/frontend.pid"

load_env() {
  if [[ -f "$ROOT_DIR/.env" ]]; then
    set -a
    # shellcheck disable=SC1091
    source "$ROOT_DIR/.env"
    set +a
  fi

  export FRONTMATTER_API_HOST="${FRONTMATTER_API_HOST:-127.0.0.1}"
  export FRONTMATTER_API_PORT="${FRONTMATTER_API_PORT:-8000}"
  export FRONTMATTER_WEB_HOST="${FRONTMATTER_WEB_HOST:-127.0.0.1}"
  export FRONTMATTER_WEB_PORT="${FRONTMATTER_WEB_PORT:-3000}"
  export API_PROXY_TARGET="${API_PROXY_TARGET:-http://${FRONTMATTER_API_HOST}:${FRONTMATTER_API_PORT}}"
}

ensure_runtime_dirs() {
  mkdir -p "$LOG_DIR"
}

require_file() {
  local path="$1"
  local message="$2"
  if [[ ! -e "$path" ]]; then
    echo "$message" >&2
    exit 1
  fi
}

require_command() {
  local command_name="$1"
  local message="$2"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$message" >&2
    exit 1
  fi
}

pid_is_running() {
  local pid_file="$1"
  if [[ ! -f "$pid_file" ]]; then
    return 1
  fi

  local pid
  pid="$(cat "$pid_file")"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

remove_stale_pid() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]] && ! pid_is_running "$pid_file"; then
    rm -f "$pid_file"
  fi
}

stop_process_group() {
  local pid_file="$1"
  local label="$2"

  if ! pid_is_running "$pid_file"; then
    remove_stale_pid "$pid_file"
    echo "$label is not running."
    return 0
  fi

  local pid
  pid="$(cat "$pid_file")"

  kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true

  for _ in {1..20}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$pid_file"
      echo "Stopped $label."
      return 0
    fi
    sleep 0.5
  done

  kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
  rm -f "$pid_file"
  echo "Force-stopped $label."
}
