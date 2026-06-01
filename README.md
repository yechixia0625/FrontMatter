# FrontMatter

**FrontMatter is a Singapore-focused commercial lease due diligence system for small businesses.**  
It helps founders evaluate whether a retail or F&B space is operationally suitable, commercially credible, and financially viable before they sign a lease.

The system combines:

- space-photo analysis
- address verification and nearby-place observation
- structured lease and operating inputs
- discounted cash flow analysis
- scenario stress testing
- candidate site comparison

FrontMatter is designed as a decision-support product, not a “guaranteed success” predictor.

## Quick Start

### 1. Start the system

```bash
sudo docker compose up -d --build
```

### 2. Open the demo

```text
http://127.0.0.1:8080
```

### 3. Sign in

- Username: `demo`
- Password: `FrontMatterDemo2026!`

### 4. What should work immediately

- login
- image upload
- Singapore address search
- Singapore-only geolocation validation
- score and risk output
- discounted cash flow panel
- what-if simulation
- candidate site comparison

## Project Idea

**FrontMatter turns Singapore shop leases into structured go / no-go business decisions.**

## Problem

In Singapore, renting the wrong commercial space is expensive.

For small operators, especially in F&B, the decision is difficult because:

- rent is high
- fit-out and reinstatement costs are significant
- compliance constraints are real
- site visits produce fragmented information
- lease decisions are still often made with spreadsheets, broker conversations, and intuition

Today, the due diligence workflow is usually manual and scattered:

1. inspect the unit
2. ask about rent and lease terms
3. check whether the space is suitable for the intended use
4. estimate traffic, spend, and costs
5. make a judgment call

FrontMatter restructures that workflow into a traceable product.

## What FrontMatter Does

FrontMatter accepts three categories of input:

- **visual input**: a space photo or floorplan
- **commercial input**: rent, size, lease term, fit-out budget, and operating assumptions
- **location input**: either current on-site coordinates or a searched address

It then returns a structured assessment across three layers:

### 1. Spatial and operational fit

The system generates a spatial blueprint and visual observations to surface:

- circulation and layout issues
- visibility opportunities
- inefficient or constrained zones
- operational friction signals

This is not CAD-grade surveying. It is a due diligence aid for early-stage lease screening.

### 2. Market and location context

The system verifies the selected site and shows nearby same-category businesses using Google Places.

It is designed specifically for **Singapore**:

- address suggestions are restricted to Singapore
- current-location mode rejects coordinates outside Singapore
- market evidence is framed around Singapore public data

Nearby businesses are treated as market observations, not as proof of demand.

### 3. Lease economics

FrontMatter does not stop at a simple monthly profit estimate.

It produces a discounted lease economics view, including:

- NPV
- IRR
- discounted payback
- break-even daily customers
- scenario comparison

Stress testing is built in so users can see what happens under weaker demand or tighter economics.

## Completed vs. Roadmap

### Completed in this repository

- deployable Docker stack
- end-to-end intake flow
- spatial blueprint output
- Singapore-only location support
- Google Places-backed location search
- traceable score output
- discounted cash flow and scenario analysis
- candidate site comparison
- anonymous calibration workflow

### Roadmap / partial capability

- property-specific rental comparables
- enterprise-grade authentication
- large-scale real-world calibration dataset
- non-Singapore market support

## Feature Matrix

| Capability | Status | Notes |
|---|---|---|
| Photo upload | Complete | PNG, JPG, WEBP |
| Spatial blueprint | Complete | Due diligence aid, not CAD |
| Singapore-only address search | Complete | Restricted to Singapore |
| Non-Singapore geolocation rejection | Complete | Unsupported region blocked |
| Nearby-place map observations | Complete | Observation signal only |
| Structured lease input form | Complete | Includes advanced assumptions |
| F&B readiness capture | Complete | Singapore-oriented operational inputs |
| Traceable scoring | Complete | Rule-based final score |
| Discounted cash flow engine | Complete | NPV, IRR, payback |
| Scenario stress testing | Complete | Baseline, downside, severe downside |
| Candidate comparison | Complete | Up to 3 user-selected sites |
| Anonymous calibration export/import | Complete | Local workflow |
| Auto-generated alternative sites | Not implemented | Intentionally disabled |
| Site-specific rental comparables | Partial | Context only |
| Production-grade auth | Partial | Demo gate only |

## Core Features

### Photo-based intake

- Upload `PNG`, `JPG`, or `WEBP`
- Analyze storefront or interior space visuals
- Generate a structured spatial blueprint

### Singapore-only location handling

- `At site now`: uses device geolocation
- `Search address`: resolves a Singapore address through Google Places
- Non-Singapore geolocation is explicitly rejected

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

This helps the product reflect the operational reality of Singapore F&B site selection.

### Traceable scoring

FrontMatter produces a structured score and supporting flags:

- `0–100` score
- score breakdown
- risk flags
- confidence level
- verdict

The numeric score is **rule-based and traceable**.  
The LLM supports interpretation and structured extraction, but does not directly invent the final score.

### Discounted cash flow and scenarios

The financial engine supports:

- baseline case
- downside case
- severe downside case

This allows the user to move from “Can this shop work?” to “How fragile is the lease under weaker conditions?”

### Candidate site comparison

Users can compare up to **three real candidate sites** they selected themselves.

The system does **not** invent alternative addresses.  
It compares user-provided candidates under the same commercial assumptions.

### What-if simulator

The workspace includes interactive controls for:

- traffic
- spend
- rent

This lets the user see how lease viability changes in real time.

### Anonymous outcome calibration

The system also includes a local outcome-recording flow:

- record actual operating outcome
- export anonymous JSON
- import anonymous JSON
- review sample count and basic error signals

This is intended to support future model calibration without exporting images or raw address text.

## Why This Is More Than a Generic AI Demo

Generic AI can describe a photo.

FrontMatter is different because it encodes a **decision workflow**:

- visual site review
- location verification
- lease screening
- F&B readiness capture
- market observations
- discounted cash flow
- scenario testing
- candidate comparison

The value is not “AI says this shop looks good.”  
The value is turning fragmented lease information into a structured business judgment process.

## Product Scope

FrontMatter is currently best described as:

> **a commercial lease screening and due diligence support system**

It is **not** a replacement for:

- a broker
- legal advice
- fire / mechanical / utilities consultants
- landlord negotiation
- a full valuation report

It does **not** guarantee:

- profitability
- actual turnover
- actual market rent
- final licensing approval

That boundary is intentional. It keeps the product credible.

## Current System Design

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Leaflet

### Backend

- FastAPI
- SQLAlchemy
- AsyncPG
- Alembic
- Redis

### Infrastructure

- Docker Compose
- PostgreSQL + pgvector
- Redis
- Nginx

## Model Configuration

This repository is currently configured around:

- **LLM provider**: GLM
- **Base URL**: `https://open.bigmodel.cn/api/paas/v4`
- **Model**: `glm-4.1v-thinking-flash`

The model is used for:

- visual understanding
- structured extraction
- advisory language

The model is **not** the direct source of the final financial score.

## External Services

### GLM API key

Required:

```text
FRONTMATTER_LLM_API_KEY
```

### Google Places API key

Required:

```text
FRONTMATTER_GOOGLE_PLACES_API_KEY
```

Official links:

- https://developers.google.com/maps/documentation/places/web-service/get-api-key
- https://console.cloud.google.com/google/maps-apis/credentials

Google Places is used for:

- address autocomplete
- address resolution
- nearby-place observations

## Deployment

The project is designed to run locally with Docker.

Default local entrypoint:

```text
http://127.0.0.1:8080
```

### Main startup command

```bash
sudo docker compose up -d --build
```

### Alternative portable compose

```bash
sudo docker compose -f docker-compose.portable.yml up -d --build
```

## Required Environment Variables

At minimum:

```text
FRONTMATTER_LLM_API_KEY=
FRONTMATTER_LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
FRONTMATTER_LLM_MODEL=glm-4.1v-thinking-flash

FRONTMATTER_GOOGLE_PLACES_API_KEY=
FRONTMATTER_GOOGLE_PLACES_SEARCH_RADIUS_METERS=500

FRONTMATTER_DEMO_AUTH_ENABLED=true
FRONTMATTER_DEMO_AUTH_USERNAME=demo
FRONTMATTER_DEMO_AUTH_PASSWORD=FrontMatterDemo2026!
FRONTMATTER_DEMO_AUTH_SECRET=replace-with-a-random-secret

PUBLIC_HTTP_PORT=8080
```

### Docker proxy note

If Docker image builds require a proxy:

```text
DOCKER_BUILD_HTTP_PROXY=
DOCKER_BUILD_HTTPS_PROXY=
DOCKER_BUILD_NO_PROXY=
DOCKER_RUNTIME_HTTP_PROXY=
DOCKER_RUNTIME_HTTPS_PROXY=
DOCKER_RUNTIME_NO_PROXY=
```

Important:

- leave `DOCKER_BUILD_*` empty unless needed
- do **not** use `127.0.0.1` for build-stage proxies unless the proxy runs inside the build container
- if a host proxy is required, use a Docker-reachable address such as `host.docker.internal`

## Demo Access

The current repository includes a lightweight shared-password demo gate for public testing.

It is suitable for:

- demos
- small-scale evaluation
- competition review

It is **not** a production-grade multi-user authentication system.

## API Surface

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### Location

- `POST /api/locations/autocomplete`
- `POST /api/locations/resolve`

### Analysis

- `POST /api/v1/analyze`

### Reports

- `GET /api/v1/reports/{id}`

### Calibration

- `POST /api/v1/calibration/outcomes`
- `GET /api/v1/calibration/export`
- `POST /api/v1/calibration/import`
- `GET /api/v1/calibration/summary`

## How to Evaluate the Demo

For a fair evaluation, the committee should assess the product on three dimensions:

### 1. Workflow quality

Does the product meaningfully improve how a founder screens a commercial lease?

### 2. Decision structure

Does the product make the reasoning behind a lease decision more transparent and auditable?

### 3. Practical relevance

Does the combination of visual review, location context, and lease economics reflect a real Singapore small-business problem?

## Known Limitations

This repository is a working product prototype, not a fully productionized commercial platform.

Current limitations include:

- market benchmarks are contextual, not property-specific rental comparables
- profitability is modeled under assumptions, not guaranteed
- location observations are not direct demand measurement
- calibration infrastructure exists, but large-scale real-world outcome data is not yet built out
- the product is intentionally restricted to Singapore use cases

## Summary

FrontMatter is an AI-native lease due diligence system built around a real operational pain point:

**small businesses must make expensive commercial lease decisions with incomplete structure and weak analytical support.**

This project demonstrates a practical product answer:

- structured intake
- visual analysis
- Singapore-specific location handling
- lease economics
- stress testing
- traceable decision support

It is designed to help a founder answer a simple but expensive question before signing:

> **Can this space become a sustainable business?**
