# FrontMatter Feature Status

This file distinguishes between what is already implemented in the repository and what remains future roadmap work.

## Feature Matrix

| Capability | Status | Notes |
|---|---|---|
| Shared demo login | Complete | Lightweight public-test gate |
| Image upload | Complete | PNG, JPG, WEBP |
| Spatial blueprint generation | Complete | Due diligence aid, not CAD measurement |
| Singapore-only address autocomplete | Complete | Google Places restricted to Singapore |
| Non-Singapore geolocation rejection | Complete | Current-location mode blocks unsupported region |
| Nearby-place map observations | Complete | Observation signal only, not demand proof |
| Structured lease input form | Complete | Rent, size, lease term, fit-out, operating assumptions |
| F&B readiness capture | Complete | Water, power, gas, exhaust, grease trap, etc. |
| Rule-based traceable scoring | Complete | LLM does not directly set the final score |
| Discounted cash flow engine | Complete | NPV, IRR, discounted payback, break-even customers |
| Scenario stress testing | Complete | Baseline, downside, severe downside |
| Interactive what-if simulation | Complete | Traffic, spend, rent controls in workspace |
| Candidate site comparison | Complete | Up to 3 user-selected sites |
| Anonymous outcome export/import | Complete | Local calibration workflow |
| Public market evidence panel | Complete | Contextual benchmark display |
| Auto-generated alternative locations | Not implemented | Intentionally disabled to avoid fabricated recommendations |
| Site-specific rental comparables | Partial | Public context only, not inferred property-level rent |
| Production-grade multi-user auth | Partial | Demo password only |
| Large-scale model calibration | Partial | Infrastructure exists; dataset is not yet mature |
| Non-Singapore support | Not implemented | Product intentionally scoped to Singapore |

## What Is Production-Like Today

- local PostgreSQL + Redis runtime
- bash start / stop / restart workflow
- authenticated web workflow
- end-to-end intake to analysis flow
- real external integrations for GLM and Google Places
- structured frontend workspace
- backend scoring and economics logic

## What Is Still Prototype-Stage

- enterprise authentication and audit controls
- large-scale historical calibration
- property-specific comparable rent intelligence
- multi-country expansion

## Evaluation Guidance

For competition review, FrontMatter should be evaluated as a **working decision-support product prototype** with real product structure and deployable system boundaries, not as a finished enterprise platform.
