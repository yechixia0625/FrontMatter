# FrontMatter Architecture

## Overview

FrontMatter is a monorepo application with a web frontend, an async API backend, and a local non-Docker runtime model.

The system supports a complete lease due diligence workflow:

1. collect a shop photo, location, and lease assumptions
2. run spatial, market, and economics analysis
3. render a structured decision-support workspace
4. optionally record anonymous real-world outcomes for future calibration

## Repository Structure

```text
backend/        FastAPI application, scoring, economics, tests
frontend/       Next.js application, intake flow, workspace UI
scripts/        Local start, stop, and restart shell scripts
docs/           Competition-facing documentation
README.md       English setup and overview
README.zh-CN.md Chinese setup and overview
FrontMatter.md  Product and technical specification
```

## System Components

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Leaflet

Responsibilities:

- image and form intake
- authentication gate
- Singapore-only location UX
- workspace rendering
- interactive what-if simulation
- candidate comparison UI

### Backend

- FastAPI
- Pydantic
- SQLAlchemy
- AsyncPG
- Redis

Responsibilities:

- authenticated API surface
- image-analysis orchestration
- Google Places integration
- traceable rule-based scoring
- discounted cash flow analysis
- calibration import/export

### Local Infrastructure

- PostgreSQL
- Redis
- bash lifecycle scripts

Responsibilities:

- persistence
- lightweight local process management
- session/cache storage

## Core Runtime Flow

### 1. Intake

The user uploads a space photo, selects a Singapore location, and enters lease inputs.

### 2. Analysis

The backend combines:

- visual model output
- lease assumptions
- Google Places observations
- rule-based scoring
- discounted cash flow computation

### 3. Workspace Rendering

The frontend renders:

- spatial blueprint or map
- agent status output
- score and risk flags
- economic analysis
- what-if controls
- candidate comparison

### 4. Calibration

The user can optionally record real outcomes and export or import anonymous JSON for future model improvement.

## Design Principles

### Traceability

Numeric scores and economic outputs are driven by explicit logic and structured inputs, not by unconstrained LLM output.

### Singapore Specificity

The product is intentionally scoped to Singapore:

- Singapore-only address suggestions
- non-Singapore geolocation rejection
- Singapore market framing
- F&B operational inputs aligned with Singapore use cases

### Local Simplicity

The repository is designed to be runnable without Docker:

- local PostgreSQL
- local Redis
- local frontend and backend processes
- bash scripts for start, stop, and restart

## Current Technical Boundaries

- the product supports due diligence, not formal valuation
- market context is public-data-based, not property-specific rental comparables
- authentication is demo-grade, not enterprise-grade
- calibration infrastructure exists, but large-scale real-world outcome data is still future work
