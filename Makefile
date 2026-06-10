.PHONY: install install-backend install-frontend start stop restart logs lint test test-backend test-frontend migrate migrate-new dev-backend dev-frontend

start:
	bash scripts/start.sh

stop:
	bash scripts/stop.sh

restart:
	bash scripts/restart.sh

logs:
	tail -f .run/logs/backend.log .run/logs/frontend.log

dev-backend:
	cd backend && . .venv/bin/activate && uvicorn src.app_factory:create_app --factory --reload --host 127.0.0.1 --port 8000

dev-frontend:
	cd frontend && API_PROXY_TARGET=http://127.0.0.1:8000 npm run dev -- --hostname 127.0.0.1 --port 3000

# Linting
lint:
	cd backend && ruff check src tests
	cd frontend && npm run lint

# Testing
test:
	$(MAKE) test-backend
	$(MAKE) test-frontend

test-backend:
	cd backend && pytest

test-frontend:
	cd frontend && npm run lint
	cd frontend && npm run build -- --webpack

# Database
migrate:
	cd backend && . .venv/bin/activate && alembic upgrade head

migrate-new:
	cd backend && . .venv/bin/activate && alembic revision --autogenerate -m "$(msg)"

# Install
install:
	$(MAKE) install-backend
	$(MAKE) install-frontend

install-backend:
	cd backend && python3.11 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -e ".[dev]"

install-frontend:
	cd frontend && npm ci
