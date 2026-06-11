#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/common.sh"

load_env
ensure_runtime_dirs

require_command "npm" "Missing 'npm'. Install Node.js 20 before starting FrontMatter."
require_file "$ROOT_DIR/backend/.venv/bin/alembic" "Missing backend virtualenv. Run: make install-backend"
require_file "$ROOT_DIR/backend/.venv/bin/python" "Missing backend virtualenv. Run: make install-backend"
require_file "$ROOT_DIR/backend/.venv/bin/uvicorn" "Missing backend dependencies. Run: make install-backend"
require_file "$ROOT_DIR/frontend/node_modules" "Missing frontend dependencies. Run: make install-frontend"

remove_stale_pid "$BACKEND_PID_FILE"
remove_stale_pid "$FRONTEND_PID_FILE"

if pid_is_running "$BACKEND_PID_FILE"; then
  echo "Backend is already running on ${FRONTMATTER_API_HOST}:${FRONTMATTER_API_PORT}."
else
  echo "Ensuring database exists..."
  (
    cd "$ROOT_DIR/backend"
    "$ROOT_DIR/backend/.venv/bin/python" src/bootstrap_database.py
  )

  echo "Running database migrations..."
  (
    cd "$ROOT_DIR/backend"
    "$ROOT_DIR/backend/.venv/bin/alembic" upgrade head
  )

  echo "Starting backend on ${FRONTMATTER_API_HOST}:${FRONTMATTER_API_PORT}..."
  (
    cd "$ROOT_DIR/backend"
    if command -v setsid >/dev/null 2>&1; then
      setsid "$ROOT_DIR/backend/.venv/bin/uvicorn" \
        src.app_factory:create_app \
        --factory \
        --host "$FRONTMATTER_API_HOST" \
        --port "$FRONTMATTER_API_PORT" \
        --reload \
        >"$LOG_DIR/backend.log" 2>&1 < /dev/null &
    else
      nohup "$ROOT_DIR/backend/.venv/bin/uvicorn" \
        src.app_factory:create_app \
        --factory \
        --host "$FRONTMATTER_API_HOST" \
        --port "$FRONTMATTER_API_PORT" \
        --reload \
        >"$LOG_DIR/backend.log" 2>&1 < /dev/null &
    fi
    echo $! > "$BACKEND_PID_FILE"
  )
fi

if pid_is_running "$FRONTEND_PID_FILE"; then
  echo "Frontend is already running on http://${FRONTMATTER_WEB_HOST}:${FRONTMATTER_WEB_PORT}."
else
  echo "Starting frontend on http://${FRONTMATTER_WEB_HOST}:${FRONTMATTER_WEB_PORT}..."
  (
    cd "$ROOT_DIR/frontend"
    if command -v setsid >/dev/null 2>&1; then
      API_PROXY_TARGET="$API_PROXY_TARGET" \
      setsid npm run dev -- --hostname "$FRONTMATTER_WEB_HOST" --port "$FRONTMATTER_WEB_PORT" \
        >"$LOG_DIR/frontend.log" 2>&1 < /dev/null &
    else
      API_PROXY_TARGET="$API_PROXY_TARGET" \
      nohup npm run dev -- --hostname "$FRONTMATTER_WEB_HOST" --port "$FRONTMATTER_WEB_PORT" \
        >"$LOG_DIR/frontend.log" 2>&1 < /dev/null &
    fi
    echo $! > "$FRONTEND_PID_FILE"
  )
fi

echo
echo "FrontMatter is starting."
echo "Frontend: http://${FRONTMATTER_WEB_HOST}:${FRONTMATTER_WEB_PORT}"
echo "Backend:  http://${FRONTMATTER_API_HOST}:${FRONTMATTER_API_PORT}"
echo "Logs:     $LOG_DIR"
