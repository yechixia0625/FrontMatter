[English](README.md) | [简体中文](README.zh-CN.md)

# FrontMatter

**FrontMatter is a Singapore-focused commercial lease due diligence system for small businesses.**

It helps founders evaluate whether a retail or F&B space is operationally suitable, commercially credible, and financially viable before they sign a lease.

FrontMatter combines:

- space-photo analysis
- Singapore-only address validation and nearby-place observation
- structured lease and operating inputs
- discounted cash flow analysis
- scenario stress testing
- candidate site comparison

FrontMatter is a decision-support product, not a guaranteed success predictor.

## Project Idea

**FrontMatter turns Singapore shop leases into structured go / no-go business decisions.**

## What This Repository Contains

- `frontend/` — Next.js web application
- `backend/` — FastAPI API, scoring engine, economics engine, tests
- `scripts/` — local start, stop, and restart bash scripts
- `docs/` — competition-facing supporting documents
- `FrontMatter.md` — product and technical specification

## Runtime Model

This repository no longer depends on Docker.

FrontMatter now runs as a standard local development stack:

- frontend: Next.js dev server
- backend: FastAPI + Uvicorn
- database: local PostgreSQL
- cache/session store: local Redis

## Prerequisites

Install these manually on your machine:

- Python `3.11`
- Node.js `20`
- PostgreSQL `16+`
- Redis `7+`

Recommended Ubuntu packages:

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip nodejs npm postgresql redis-server
```

If you use `nvm`, install Node.js 20 explicitly:

```bash
nvm install 20
nvm use 20
```

## Required Accounts and API Keys

You need:

- a GLM API key
- a Google Places API key

Google Places API application link:

```text
https://developers.google.com/maps/documentation/places/web-service/get-api-key
```

## Local Setup

Before starting FrontMatter, make sure PostgreSQL and Redis are running.

Example on Ubuntu:

```bash
sudo systemctl enable --now postgresql
sudo systemctl enable --now redis-server
```

### 1. Create the database

Create a local PostgreSQL database named `frontmatter`.

Example:

```bash
sudo -u postgres psql
CREATE DATABASE frontmatter;
\q
```

If your local PostgreSQL username or password is different, update `.env` accordingly.

### 2. Copy the environment template

```bash
cp .env.example .env
```

Then edit `.env` and set:

- `FRONTMATTER_DATABASE_URL`
- `FRONTMATTER_REDIS_URL`
- `FRONTMATTER_LLM_API_KEY`
- `FRONTMATTER_GOOGLE_PLACES_API_KEY`
- `FRONTMATTER_DEMO_AUTH_PASSWORD`
- `FRONTMATTER_DEMO_AUTH_SECRET`

### 3. Install backend dependencies

```bash
make install-backend
```

This creates `backend/.venv` and installs the Python dependencies from `backend/pyproject.toml`.

### 4. Install frontend dependencies

```bash
make install-frontend
```

This installs the Node.js dependencies from `frontend/package.json`.

## Start, Stop, Restart

The repository includes bash scripts for local lifecycle management.

### Start

```bash
bash scripts/start.sh
```

or:

```bash
make start
```

### Stop

```bash
bash scripts/stop.sh
```

or:

```bash
make stop
```

### Restart

```bash
bash scripts/restart.sh
```

or:

```bash
make restart
```

## Local URLs

Default local endpoints:

- frontend: `http://127.0.0.1:3000`
- backend: `http://127.0.0.1:8000`

## Demo Credentials

If demo auth is enabled in `.env`:

- Username: `demo`
- Password: value of `FRONTMATTER_DEMO_AUTH_PASSWORD`

## Logs

The start script writes runtime files to:

```text
.run/
```

Important files:

- `.run/backend.pid`
- `.run/frontend.pid`
- `.run/logs/backend.log`
- `.run/logs/frontend.log`

To follow both logs:

```bash
make logs
```

## Database Migration

Run migrations manually:

```bash
make migrate
```

Create a new Alembic migration:

```bash
make migrate-new msg="describe-change"
```

## Development Commands

Backend only:

```bash
make dev-backend
```

Frontend only:

```bash
make dev-frontend
```

Run lint:

```bash
make lint
```

Run tests:

```bash
make test
```

## Core Features

### Photo-based intake

- upload `PNG`, `JPG`, or `WEBP`
- analyze storefront or interior visuals
- generate a structured spatial blueprint

### Singapore-only location handling

- `At site now`: uses device geolocation
- `Search address`: resolves a Singapore address through Google Places
- non-Singapore geolocation is explicitly rejected

### Structured lease and operating inputs

The intake flow captures:

- monthly rent
- shop size
- lease term
- service charge
- fit-out budget
- rent-free period
- deposit months
- utilities
- staffing
- marketing
- insurance
- licence fees
- reinstatement cost
- rent escalation
- revenue growth
- turnover rent
- opening ramp months
- discount rate
- daily customers
- average spend
- gross margin

### F&B readiness screening

For restaurant and food-service use cases, the form also captures:

- cooking intensity
- approved use status
- water readiness
- electrical readiness
- gas
- floor trap
- grease trap
- exhaust
- wastewater
- loading access
- signage

### Traceable scoring

- final numeric scoring is rule-based
- LLM output does not directly set the final score
- financial assumptions are visible and inspectable

### Lease economics

FrontMatter outputs:

- NPV
- IRR
- discounted payback
- break-even daily customers
- baseline / downside / severe downside scenarios

### Candidate comparison

- compare up to 3 user-selected sites
- keep business assumptions constant while comparing locations

## Feature Status

| Capability | Status | Notes |
|---|---|---|
| Shared demo login | Complete | Lightweight public-test gate |
| Image upload | Complete | PNG, JPG, WEBP |
| Spatial blueprint generation | Complete | Due diligence aid, not CAD measurement |
| Singapore-only address autocomplete | Complete | Google Places restricted to Singapore |
| Non-Singapore geolocation rejection | Complete | Unsupported region blocked |
| Nearby-place map observations | Complete | Observation signal only |
| Structured lease input form | Complete | Rent, size, lease term, fit-out, operating assumptions |
| F&B readiness capture | Complete | Water, power, gas, exhaust, grease trap, etc. |
| Rule-based traceable scoring | Complete | LLM does not directly set the final score |
| Discounted cash flow engine | Complete | NPV, IRR, discounted payback, break-even customers |
| Scenario stress testing | Complete | Baseline, downside, severe downside |
| Interactive what-if simulation | Complete | Traffic, spend, rent controls in workspace |
| Candidate site comparison | Complete | Up to 3 user-selected sites |
| Anonymous outcome export/import | Complete | Local calibration workflow |
| Public market evidence panel | Complete | Contextual benchmark display |
| Auto-generated alternative locations | Not implemented | Intentionally disabled |
| Site-specific rental comparables | Partial | Public context only |
| Production-grade multi-user auth | Partial | Demo password only |

## Current Technical Boundaries

- this is a due diligence aid, not a legal, valuation, or surveying tool
- market context is public-data-based, not property-specific rent intelligence
- outcomes depend on user assumptions
- authentication is demo-grade, not enterprise-grade

## Supporting Documents

- [Architecture](docs/ARCHITECTURE.md)
- [Feature Status](docs/feature-status.md)
- [Demo Walkthrough](docs/demo-walkthrough.md)
