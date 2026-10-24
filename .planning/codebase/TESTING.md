# Testing Strategy & Guidelines

## Overview

OBLIQ-in uses the native Node.js test runner (`node:test`) and reporter (`node:test/reporters`), eliminating heavyweight external test runners (such as Jest or Vitest) to keep dependencies lean and test execution fast.

## Test Directory Structure

```text
tests/
├── client/                      # Frontend pure logic & state tests
│   ├── dashboard-metrics.test.mjs # Metric & KPI calculation validation
│   ├── relative-time.test.mjs   # Time formatting & humanized dates
│   └── timer-state.test.mjs     # Timer serialization & elapsed time calculation
├── integration/                 # Real PostgreSQL database tests
│   └── invitations.test.mjs     # Migration, concurrency, rollback & tenant isolation tests
├── scripts/
│   └── run.mjs                  # Dynamic concurrent test discovery runner
└── server/                      # Server input validation & mock route tests
    ├── api-workspace-source.test.mjs # API adapter serialization
    ├── invitations.test.mjs     # Invitation service input & hashing checks
    ├── security-headers.test.mjs# HTTP security headers verification
    ├── storage-validation.test.mjs # LocalStorage JSON validation
    ├── workspace-input.test.mjs # Zod schemas for workspace records
    └── workspace-source.test.mjs # In-memory local workspace behavior
```

## Running Tests

### 1. Fast Non-Database Suite (Default)

Runs all client and server unit tests concurrently:

```bash
npm test
```

_Note: Automatically skips `tests/integration/`._

### 2. Client Tests Only

```bash
npm run test:client
```

### 3. Server Tests Only

```bash
npm run test:server
```

### 4. Database Integration Tests

Requires a dedicated, disposable PostgreSQL test database ending in `_test`:

```bash
$env:TEST_DATABASE_URL="postgres://obliq:obliq@127.0.0.1:5433/obliq_test"
npm run test:db
```

The integration suite tests:

- Base-to-follow-up schema migrations
- Tenant isolation and role permissions
- Concurrency locks during invitation redemption
- Transactional rollback on injected audit failures

### 5. Complete CI Check

To reproduce the full GitHub Actions CI pipeline locally:

```bash
npm run check
```

Runs:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
