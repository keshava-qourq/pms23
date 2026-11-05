<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-05

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Angular

## Decision Outcome

Chosen option: React 19, because Builds the four interaction-heavy surfaces (goal trackers, multi-step forms, dashboards, praise threads) as a responsive SPA served from CloudFront; widest developer pool for a tight deadline.

## Consequences

SPA needs its own auth/token handling and routing; delivered responsive-only, with no native mobile per scope.
<!-- sdlc:auto:end adr -->