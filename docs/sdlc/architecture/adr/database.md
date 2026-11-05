<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-05

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQL Server

## Decision Outcome

Chosen option: PostgreSQL 16, because Enforces the relational model (reporting lines, cascaded goals, objectives, check-ins) and runs the dashboard aggregates reliably; jsonb stores audit change-sets and row-level control suits sensitive HR data.

## Consequences

Heavy concurrent dashboard aggregation is mitigated with the Redis cache rather than read replicas at this scale.
<!-- sdlc:auto:end adr -->