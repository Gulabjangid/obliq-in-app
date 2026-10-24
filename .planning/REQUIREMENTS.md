# Project Requirements

## Functional Requirements

### 1. Identity, Authentication & Onboarding

- **REQ-AUTH-01**: Secure OAuth authentication (Auth0 / NextAuth) decoupled from `users` table via `user_identities`.
- **REQ-AUTH-02**: First-time user onboarding modal to distinguish whether an account is an internal Firm member or a Client user.
- **REQ-AUTH-03**: Firm creation wizard allowing owner to establish firm legal name, Indian GSTIN/PAN metadata, and fiscal year preferences.

### 2. Team & Invitations Management

- **REQ-TEAM-01**: Single-use, cryptographically secure (256-bit) invitation links for `article_assistant` and `reviewer` roles.
- **REQ-TEAM-02**: Configurable expiration periods (1 to 30 days, defaulting to 7 days).
- **REQ-TEAM-03**: Revocation capability for active outstanding invites with instant invalidation.
- **REQ-TEAM-04**: Role-based access control (RBAC) matrix defining owner vs reviewer vs article assistant capabilities.

### 3. Engagement & Client Management

- **REQ-ENG-01**: Client directory with status tracking (Active, Inactive), primary contact information, and engagement counters.
- **REQ-ENG-02**: Project/engagement tracking categorized by tax domain (GST, Income Tax Audit, ROC, Statutory Audit).
- **REQ-ENG-03**: Progress tracking (0-100%) and assignment to designated team leads.

### 4. Time Tracking & Billing

- **REQ-TIME-01**: Persistent real-time timer tracking hours worked on active engagements across page refreshes and browser tabs.
- **REQ-TIME-02**: Time entry logging persisted to database (`time_entries`) with association to project and user.
- **REQ-TIME-03**: Invoice draft creation with amounts, due dates, and statuses (Draft, Awaiting payment, Overdue, Paid).

### 5. Document Vault & OCR Pipeline

- **REQ-DOC-01**: Document metadata management (Proposals, Contracts, Forms).
- **REQ-DOC-02**: Secure document upload handling for PDFs and image scans (bills, invoices, challans).
- **REQ-DOC-03**: Extraction of revenue-register fields (GSTIN, Invoice #, Invoice Date, Taxable Value, CGST, SGST, IGST) with confidence scores and source coordinate bounding boxes.

## Non-Functional Requirements

### Security & Privacy

- **NFR-SEC-01**: Complete multi-tenant workspace isolation. Queries must never rely on client-supplied `firmId`.
- **NFR-SEC-02**: Strict HTTP security headers (CSP, HSTS, X-Content-Type-Options, Frame-Options) on all route handlers and pages.
- **NFR-SEC-03**: Zero hardcoded secrets; credentials confined to server-only runtime environment.

### Performance & Reliability

- **NFR-PERF-01**: Zero layout shift and instant screen switching via the persistent `<DashboardApp />` layout.
- **NFR-PERF-02**: Local-first fallback preserving UI functionality even when storage or database connections are interrupted.
- **NFR-PERF-03**: Dynamic test concurrency executing unit test suites under 1 second.
