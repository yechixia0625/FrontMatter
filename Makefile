.PHONY: up down build rebuild logs lint test test-backend test-frontend migrate

# Docker
up:
	docker compose up -d

rebuild:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

# Development
dev-api:
	cd backend && uvicorn src.app_factory:create_app --factory --reload --port 8000

dev-web:
	cd frontend && npm run dev

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
	cd backend && alembic upgrade head

migrate-new:
	cd backend && alembic revision --autogenerate -m "$(msg)"

# Install
install:
	cd backend && pip install -e ".[dev]"
	cd frontend && npm install
