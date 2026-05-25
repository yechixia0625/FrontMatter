.PHONY: up down build logs lint test migrate

# Docker
up:
	docker compose up -d

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
	cd backend && pytest
	cd frontend && npm test

# Database
migrate:
	cd backend && alembic upgrade head

migrate-new:
	cd backend && alembic revision --autogenerate -m "$(msg)"

# Install
install:
	cd backend && pip install -e ".[dev]"
	cd frontend && npm install
