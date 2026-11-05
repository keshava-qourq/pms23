<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-05

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Azure
- GCP

## Decision Outcome

Chosen option: AWS, because Single-region RDS, ElastiCache and ECS give dependable hosting, backups, access controls and data-residency for one organisation's HR data.

## Consequences

Managed services add cost and some AWS coupling, acceptable for an internal tool.
<!-- sdlc:auto:end adr -->