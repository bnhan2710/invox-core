# Einvoice – Microservice Monorepo

Einvoice is an electronic invoicing platform built as a **microservice** system on top of an **Nx monorepo**, using **NestJS** as the primary backend framework.

This repository contains:

- A **BFF (Backend for Frontend)** for web / client applications
- Domain microservices: **IAM**, **Authorizer**, **Invoice**, **Product**, **Media**, **PDF Generator**, **Mail**, etc.
- Per-service **Clean Architecture / Hexagonal** layering (application, infrastructure, presentation)
- **Event-driven communication** with Kafka and data persistence primarily in MongoDB

---

## High-Level Architecture

The workspace is organized as an Nx monorepo:

- `apps/`

  - `bff` – API gateway / BFF for the frontend
  - `iam-service` – Identity & Access Management
  - `authorizer-service` – Authorization & policy handling
  - `invoice-service` – Invoice lifecycle, payment integration and email triggers
  - `product-service` – Product / catalog management
  - `pdf-generator` – Invoice PDF rendering service
  - `media-service` – File upload and storage handling
  - `mail-service` – Email sending (e.g. sending invoices)

- `libs/`
  - `constants` – Shared enums, error codes and constants
  - `schemas` – MongoDB schemas (Invoice, User, Product, etc.)
  - `configuration` – Shared configuration modules (Mongo, Postgres, Redis, Kafka, TCP/GRPC, throttling, etc.)
  - `interfaces` – DTOs, TCP/Kafka payload contracts, gateway DTOs
  - `kafka` – Kafka module and wrapper service
  - Other shared libraries: guards, interceptors, middlewares, decorators, utilities, …

**Service communication**

- **TCP / gRPC** for synchronous service-to-service communication
- **Kafka** for asynchronous, event-driven flows (e.g. `invoice_process_send`, `invoice_sent` topics)

**Infrastructure & providers**

- MongoDB as the primary persistence layer
- Kafka, Redis, Postgres and other providers orchestrated via `docker-compose.provider.yaml`

---

## Prerequisites

- **Node.js** >= 22
- **pnpm** (recommended) – npm or yarn can work, but scripts assume pnpm
- **Docker & Docker Compose** – for local infrastructure (MongoDB, Kafka, Redis, etc.)

Install `pnpm` globally if needed:

```bash
npm install -g pnpm
```

---

## Getting Started (Local Development)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start infrastructure providers (MongoDB, Kafka, Redis, Postgres, …)

```bash
pnpm docker:start:provider
```

This uses `docker-compose.provider.yaml` to bring up the shared infrastructure required by all services.

### 3. Run all services in development mode

```bash
pnpm dev
```

This script will:

- Run `nx reset` to clear Nx cache
- Run `nx run-many -t serve` for all configured apps

### 4. Run a "light" dev environment (subset of core services)

```bash
pnpm dev-lite
```

By default, this starts: `bff`, `iam-service`, `authorizer-service`, `invoice-service`, `pdf-generator`, `media-service`, `mail-service`.

---

## Running Individual Services

Use Nx directly when you want to focus on a single service:

- **BFF**

```bash
pnpm nx serve bff
```

- **Invoice Service**

```bash
pnpm nx serve invoice-service
```

- **IAM Service** (example)

```bash
pnpm nx serve iam-service
```

- **Inspect available targets for a project**

```bash
pnpm nx show project invoice-service
```

---

## Linting, Testing and Building

### Lint

Run lint across the workspace (via ESLint and Nx):

```bash
pnpm lint
```

Auto-fix lint issues where possible:

```bash
pnpm fix
```

### Build

Build a specific service:

```bash
pnpm nx build invoice-service
```

### Affected (CI-friendly)

Use Nx affected to only run tasks on projects impacted by the current changes:

```bash
pnpm nx:affected
# or directly
nx affected -t lint,test,build
```

This is especially useful in CI to keep pipelines fast in a large monorepo.

---

## CI/CD Overview

The repository is structured to integrate cleanly with modern CI/CD platforms (GitHub Actions, GitLab CI, Jenkins, etc.). A typical pipeline can include:

**CI stages**

- `nx affected -t lint,test,build` for pull requests
- Build Docker images **only** for affected services
- Push images to a container registry (tagged with `git-sha`, `branch-latest`, etc.)

**CD stages**

- **Development / Staging**: automatic deployment from a branch like `develop`
- **Production**: deployment from tags or `main`, optionally gated by manual approval

Leveraging **Nx Cloud** or a compatible remote cache is highly recommended to significantly reduce build and test times in CI.

---

## Useful Nx Commands

- **View the project dependency graph**

```bash
pnpm nx graph
```

- **List installed plugins and generators**

```bash
pnpm nx list
pnpm nx list @nx/nest
```

- **Run an arbitrary target**

```bash
pnpm nx run <project>:<target>
# examples
pnpm nx run invoice-service:lint
pnpm nx run invoice-service:test
```

---

## Contribution Guidelines

To keep the codebase consistent and maintainable:

- Follow **Clean Architecture / Ports & Adapters** per module/service:

  - `application/` – use cases, services, ports (interfaces)
  - `infrastructure/` – repositories, adapters (Mongo, Postgre, Kafka, TCP, Stripe, Media, etc.)
  - `presentation/` – controllers, TCP/Kafka consumers

- Use **DI tokens** (e.g. `*.di-tokens.ts`) instead of direct class references across layers to minimize coupling.

- When adding a new service:

  - Generate a Nest app using Nx generators
  - Apply the same folder structure (application/infrastructure/presentation)
  - Add necessary configuration into shared libs (`configuration`, `constants`, `interfaces`, etc.)

- Prefer `nx affected` in your local workflow when working on larger changes, to mimic CI behavior and save time.

---
