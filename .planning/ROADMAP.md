# Project Roadmap

## Milestone 1: Core Foundation & Team Workspace (Current)

### Phase 1: Authentication & User Onboarding
- **Goal**: Transition from dev stub to production-grade authentication with guided onboarding.
- **Tasks**:
  - [ ] Connect Auth0 / OAuth provider in `src/server/auth/session.ts` (Issue #10)
  - [ ] Implement onboarding UI flow to select account type (Firm vs Client) (Issue #11)
  - [ ] Support initial Firm creation and owner setup
- **Verification**: New users can log in, choose account role, create firm, and populate session correctly.

### Phase 2: Team Invitation & Role Management UI
- **Goal**: Expose firm invitations backend in the frontend Settings/Team screens.
- **Tasks**:
  - [ ] Build Team tab in Settings screen ([src/components/dashboard/pages/settings.tsx](file:///e:/Open%20Source/Obliq-in-app/src/components/dashboard/pages/settings.tsx)) (Issue #13)
  - [ ] Create invite modal with role selection (`article_assistant`, `reviewer`) and expiry selector (1-30 days)
  - [ ] Display active, expired, and revoked invitation lists with one-click revocation
  - [ ] Implement invitation redemption UI for colleagues joining via link or code
- **Verification**: Firm owner can generate invite link, an invitee can redeem it in browser, and member list updates instantly.

### Phase 3: Form ID Upgrades & Live Metrics
- **Goal**: Clean up technical debt from MVP v1.
- **Tasks**:
  - [ ] Refactor creation modals to pass client/project UUIDs rather than names (Issue #7)
  - [ ] Replace hardcoded design fixtures with SQL aggregation queries for dashboard KPI cards and earnings chart
  - [ ] Add pagination and search filtering to project and client queries in backend
- **Verification**: Creating projects and invoices links directly by UUID; dashboard statistics reflect real database entries.

---

## Milestone 2: Document Vault & OCR Pipeline (Upcoming)

### Phase 4: Document Storage & Client Upload Workspace
- **Goal**: Enable direct file uploads for bills, invoices, and challans.
- **Tasks**:
  - [ ] Set up secure cloud object storage (S3-compatible / R2 / GCS) with signed URLs
  - [ ] Build Client Upload Workspace portal with constrained client view
  - [ ] Implement document versioning and audit trail

### Phase 5: Revenue-Register OCR Extraction Engine
- **Goal**: Automate financial data extraction with source verification.
- **Tasks**:
  - [ ] Ingest invoices/receipts and trigger OCR worker
  - [ ] Extract proposed revenue-register fields (GSTIN, dates, amounts, taxes) with confidence scoring
  - [ ] Build interactive bounding-box coordinate viewer for CA review and verification
