# Integrations

## Database Integration
- **PostgreSQL**:
  - Connection Pool: Managed lazily in [src/server/db/client.ts](file:///e:/Open%20Source/Obliq-in-app/src/server/db/client.ts) using the `postgres` library.
  - Environment Variables:
    - `DATABASE_URL`: Primary connection string for application runtime and migrations.
    - `TEST_DATABASE_URL`: Dedicated connection string for disposable integration test runner (`tests/integration/`).
  - Local Container: `docker-compose.yml` runs PostgreSQL 17 on `127.0.0.1:5433` (`obliq:obliq` credentials).

## Authentication & Identity
- **Status**: Development stub active; Auth0 integration pending (Issue #10).
- **Session Layer**: [src/server/auth/session.ts](file:///e:/Open%20Source/Obliq-in-app/src/server/auth/session.ts).
- **Mechanism**:
  - Development acts as a seeded user via `DEV_AUTH_ID`.
  - In production (`NODE_ENV === "production"`), routes return 401 until Auth0 is linked.
  - Provider decoupling: `user_identities` table separates `provider` and `provider_user_id` from the canonical `users.id` (UUID), allowing multiple identity providers without schema alterations.

## Workspace Source Switch
- **Toggle**: `NEXT_PUBLIC_WORKSPACE_SOURCE` (`"api"` | `"local"`)
- **API Mode**: Calls `/api/workspace`, `/api/workspace/records`, `/api/workspace/time` via [src/lib/api-workspace-source.ts](file:///e:/Open%20Source/Obliq-in-app/src/lib/api-workspace-source.ts).
- **Local Mode (Default)**: Uses browser `window.localStorage` with fallback to design fixtures in [src/data/dashboard.ts](file:///e:/Open%20Source/Obliq-in-app/src/data/dashboard.ts).

## Firm Invitations & Security Boundary
- **Owner Endpoints**: `/api/firm/invitations` (GET, POST, DELETE) guarded by owner session verification.
- **Redemption Endpoint**: `/api/invitations/redeem` (POST) allowing new users with `firmId: null` to join target firm.
- **Security**: 256-bit random cryptographic invitation codes, stored hashed via SHA-256 in `firm_invites.code`. Mutation routes reject cross-origin requests and enforce `Cache-Control: no-store`.

## External Services & Planned Integrations
- **Email Delivery**: Not implemented; invitations display token directly in creation payload for manual sharing.
- **File Storage & OCR**: Planned for subsequent phases (client upload workspace, receipt/invoice scanning, proposal generation).
- **CI / GitHub Actions**: `.github/workflows/check.yml` spins up `postgres:17-alpine` service container and runs linting, formatting, type checking, unit tests, and database integration tests.
