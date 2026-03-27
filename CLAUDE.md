# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Maritime beacon registration service for the UK Maritime and Coastguard Agency (MCA). Monorepo with three main applications:

- **webapp/** — Public-facing NextJS 15 frontend for beacon registration (port 3000)
- **backoffice/** — React SPA for MCA staff to manage registrations (port 3001)
- **service/** — Spring Boot 2.5 backend API with Postgres + OpenSearch (port 8080)
- **tests/** — Cypress end-to-end and smoke tests

## Local Development

### Starting the full stack

```bash
make setup          # First time: install all dependencies and git hooks
make serve          # Start all services (Docker backing services + webapp + backoffice)
```

This starts: Postgres, OpenSearch, Redis, the Spring Boot service, webapp (NextJS), and backoffice (Vite).

### Starting individual services

```bash
make serve-backing-services   # Docker Compose: Postgres, OpenSearch, Redis, service
make serve-webapp             # NextJS dev server (port 3000)
make serve-backoffice         # Backoffice Vite dev server with MirageJS stubs (port 3001)
```

### Environment variables

- **Webapp**: copy `webapp/.env.example` → `webapp/.env.local` and fill in values
- **Service**: create `service/src/main/resources/application-dev.yml` with Spring config; run with `SPRING_PROFILES_ACTIVE=dev,seed` (the `seed` profile auto-loads test data)
- **Tests**: copy `tests/.env.example` → `tests/.env`

Key secrets across the stack: Azure B2C credentials, Microsoft Graph credentials, `JWT_SECRET`/`NEXTAUTH_SECRET`, `GOV_NOTIFY_API_KEY`, OpenSearch config.

## Requirements

- Node ^20.19.1, npm ^10.8.2
- Java 17, Docker (for TestContainers and backing services)

## Commands

### Webapp (NextJS + TypeScript)

```bash
cd webapp
npm run dev              # Dev server with Turbopack
npm test                 # Jest tests
npm test -- path/to/file.test.ts                   # Single test file
npm test -- --testNamePattern="description"        # By name
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run lint             # ESLint
npm run cypress:open     # Cypress interactive
npm run cypress:run -- --spec "cypress/integration/path/to/spec.ts"
```

### Service (Spring Boot + Java 17 + Gradle)

```bash
cd service
./gradlew bootRun                                              # Run locally
./gradlew clean test                                           # Unit tests
./gradlew clean integrationTest                                # Integration tests (requires Docker for TestContainers)
./gradlew clean check                                          # Both unit + integration
./gradlew test --tests "uk.gov.mca.beacons.api.ClassName"     # Single class
```

### Backoffice (React + Vite + TypeScript)

```bash
cd backoffice
npm start                # Dev server with MirageJS API stubs
npm run start:no-api-stub  # Dev server without stubs
npm test                 # Jest tests
npm run test:watch       # Watch mode
npm run test:mutation    # Stryker mutation tests
npm run lint             # ESLint
npm run lint:fix         # Auto-fix
```

### Code formatting (root)

```bash
npm run format           # Prettier across all projects (Java, JS, TS, JSON, YAML, CSS, MD)
npm run format:check     # Check without modifying
```

### End-to-end tests

```bash
cd tests
npm run test:e2e         # Cypress headless
npm run test:e2e:open    # Cypress interactive
```

## Architecture

### Data flow

Users register beacons via **Webapp** → **Spring API** → **Postgres** (primary store). Beacon data is also indexed in **OpenSearch** for fast querying by search and rescue centres. MCA staff manage registrations via the **Backoffice SPA**, which is served by Spring Boot at the `/backoffice` path.

### Authentication

- **Webapp**: Next-Auth with Azure B2C (public users)
- **Service**: Spring Security with Azure AD (MCA staff / service-to-service)
- **Backoffice**: Azure MSAL Browser with Azure AD B2C

### Service internals (Spring Boot)

- Spring Data JPA + Flyway for Postgres migrations
- Spring Batch + ShedLock for scheduled/distributed jobs
- OpenSearch client for search indexing
- Export to Excel (Apache POI) and PDF (iText7)
- OpenAPI docs available at `/spring-api/swagger-ui.html` when running

Each domain (registration, beacon, beaconowner, beaconuse, accountholder, emergencycontact) follows this layered structure:

```
api/<domain>/
  domain/       # JPA entities and value objects
  application/  # Services / use cases
  hibernate/    # Spring Data repositories
  mappers/      # Entity ↔ DTO conversions
  rest/         # REST controllers
```

Test classes are named `*UnitTest` (JUnit, no Spring context) and `*IntegrationTest` (TestContainers, needs Docker).

### Frontend source structure

Both `webapp/src` and `backoffice/src` share a similar layout:

- `gateways/` — API integration layer (all calls to the Spring API go here)
- `entities/` — TypeScript type definitions
- `useCases/` — Business logic functions (webapp only)
- `components/` — Reusable UI components
- `views/` (backoffice) / `pages/` (webapp) — Page-level containers

Webapp uses `govuk-frontend` (GOV.UK Design System) for UI components.

### Backoffice internals

- Appbase ReactiveSearch components connect directly to the OpenSearch proxy (port 8081)
- MUI X Data Grid Pro for tabular data
- MirageJS intercepts API calls for local development with stubs (`npm start`)

### Docker Compose services

| Service               | Port | Purpose                                               |
| --------------------- | ---- | ----------------------------------------------------- |
| postgres              | 5432 | Primary database (beacons / beacons_service:password) |
| opensearch            | 9200 | Search engine                                         |
| opensearch-proxy      | 8081 | Authenticated proxy to OpenSearch                     |
| opensearch-dashboards | 5601 | OpenSearch UI                                         |
| redis                 | 6379 | NextJS session storage                                |
| service               | 8080 | Spring Boot API                                       |
| backoffice            | 3001 | Backoffice SPA (production build in Docker)           |
| webapp                | 3000 | NextJS (production build in Docker)                   |

### CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `on-merge-to-main.yml` — build + deploy to dev
- `on-pre-release.yml` — build versioned images for staging
- `on-release-published.yml` — deploy to production (requires approval)

Infrastructure is managed via Terraform in `/terraform/`.

## ADRs

Architectural Decision Records are in `docs/adr/`. Run `npm run adr` from root to regenerate the ADR log.

## Ways of working

- Always use tests, if we ask for help with a bug, start with a failing test, even if you have to write it.
- When fixing bugs, always try for the smallest, lowest impact change that will fix the bug.
