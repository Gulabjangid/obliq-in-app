# Technical Concerns & Future Roadmap

## High Priority Gaps

### 1. Authentication Integration (Issue #10)

- **Current State**: Uses a development stub controlled by the `DEV_AUTH_ID` environment variable. In production (`NODE_ENV === "production"`), `getSession()` returns `null`, causing all workspace routes to return `401 Unauthorized`.
- **Target**: Integrate Auth0 / NextAuth with `user_identities` table to provide secure session tokens and OAuth logins.

### 2. Onboarding Flow & Firm Creation UI (Issue #11)

- **Current State**: New accounts signed in with no firm membership receive a `403 Forbidden` (`code: "onboarding_required"`).
- **Target**: Build onboarding screens where users declare their user type (`firm` vs `client`) and create their first CA firm or redeem an invitation code.

### 3. Invitation Management UI (Issue #13)

- **Current State**: Backend endpoints (`/api/firm/invitations` and `/api/invitations/redeem`) are fully tested and functional (Issue #12), but no user interface exists in the Settings or Team screens to generate, list, or revoke invitations.
- **Target**: Implement modal and table views for firm owners in `src/components/dashboard/pages/settings.tsx`.

## Medium Priority & Technical Debt

### 4. Client/Project Name Lookups instead of UUIDs (Issue #7)

- **Current State**: Form modals send string names (`values.client`), and `src/server/workspace/service.ts` performs secondary lookups by name within the firm.
- **Target**: Update UI forms (`workspace-modal.tsx`) to pass unique `clientId` and `projectId` directly.

### 5. Static Analytics & Earnings Fixtures

- **Current State**: The headline metrics (KPIs) and earnings chart on the home screen draw data from design fixtures in `src/data/dashboard.ts`.
- **Target**: Implement SQL aggregation endpoints in `src/server/workspace/service.ts` to compute live billing, unbilled hours, and earnings.

### 6. Role-Based Access Control (RBAC) & Permission Matrix (Issue #29)

- **Current State**: Only `owner`, `article_assistant`, and `reviewer` roles exist. Permissions are largely binary (owner vs non-owner).
- **Target**: Establish granular permissions for document sign-offs, tax filing visibility, and invoice approvals.

### 7. File Storage, OCR & Revenue Register Extraction

- **Current State**: Documents table tracks metadata only (`Proposal`, `Contract`, `Form`). No cloud storage (S3/R2/GCS) or PDF/receipt OCR extraction engine is currently hooked up.
- **Target**: Core OBLIQ value proposition: OCR extraction of invoice/challan fields with confidence scoring and source coordinate mapping.
