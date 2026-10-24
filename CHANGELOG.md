# Changelog

All notable changes to the OBLIQ-in application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Firm Invitations Backend (Issue #12, PR #27)**:
  - Cryptographically secure single-use invitation tokens (256 random bits, SHA-256 hashed).
  - Owner endpoints for generating, listing, and revoking invitations (`/api/firm/invitations`).
  - Public/authenticated redemption endpoint (`/api/invitations/redeem`) with transactional row-level locks.
  - Added `reviewer` role enum alongside `owner` and `article_assistant`.
  - Dedicated PostgreSQL integration tests for invitation lifecycle, concurrency, and rollback.
- **Community Standards & Project Governance**:
  - Contributor Covenant v2.1 [Code of Conduct](CODE_OF_CONDUCT.md) with CA-specific financial privacy protections.
  - [Security Policy](SECURITY.md) outlining vulnerability disclosure timelines, safe harbor, and isolation invariants.
  - [Support Guidelines](SUPPORT.md) connecting contributors to GitHub Discussions and CA domain review.
  - Structured GitHub Issue templates for bug reports and feature requests.
  - Structured codebase intelligence and project planning artifacts in `.planning/`.

## [0.1.0] - 2026-10-15

### Added

- **OBLIQ Dashboard v1**:
  - Core workspace dashboard frontend following Figma specifications.
  - Screens: Home, Projects, Clients, Invoices, Contracts & Documents, Balance, Accounting, Taxes, Time Tracking, and Settings.
  - Real-time persistent timer session retained across URL transitions and browser reloads without external state dependencies.
  - Search modal and filter widgets for projects, clients, and invoices.
- **Dual-Mode Persistence Layer**:
  - `WorkspaceSource` adapter contract enabling seamless operation in local preview (`localStorage`) and API mode (`PostgreSQL`).
  - Runtime JSON storage validators with fixture fallbacks.
- **Backend Architecture & Database Foundation**:
  - Next.js 15 App Router API handlers (`/api/health`, `/api/workspace`, `/api/workspace/records`, `/api/workspace/time`).
  - PostgreSQL 15+ database integration managed with Drizzle ORM and Drizzle Kit.
  - Initial relational schema: `users`, `user_identities`, `firms`, `firm_members`, `firm_invites`, `clients`, `projects`, `invoices`, `documents`, `time_entries`, and `activity`.
  - Development session resolver using `DEV_AUTH_ID` and database seeder.
- **Quality & CI Infrastructure**:
  - Native Node.js test runner (`node:test`) harness with dynamic concurrency based on CPU cores (`tests/scripts/run.mjs`).
  - GitHub Actions CI pipeline executing format checks, ESLint, TypeScript compilation, unit tests, and isolated Postgres integration tests.
