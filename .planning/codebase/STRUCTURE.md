# Directory & Module Structure

## File Tree & Layout

```text
obliq-in-app/
├── .github/
│   └── workflows/
│       ├── check.yml             # CI check workflow (Postgres 17 service, lint, test, test:db)
│       └── labeler.yml           # Automatic PR labeler by changed path
├── .husky/                       # Git pre-commit hooks
├── docs/
│   ├── lld.md                    # Low-Level Design & architecture specification
│   └── firm-invitations.md       # Firm invitations API & redemption contract (Issue #12)
├── drizzle/                      # Generated database migrations
│   ├── 0000_init.sql             # Initial workspace schema
│   ├── 0001_firm_invitations.sql # Reviewer role & invitation enhancements
│   └── meta/                     # Drizzle schema snapshots
├── public/                       # Static public assets
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [section]/page.tsx    # Dynamic route handler & section validator
│   │   ├── api/                  # API Route Handlers
│   │   │   ├── firm/invitations/ # Owner invitation management (GET, POST, DELETE)
│   │   │   ├── health/route.ts   # System and DB healthcheck endpoint
│   │   │   ├── invitations/redeem/ # Public/authenticated invitation redemption
│   │   │   └── workspace/        # Workspace data, record creation, time logging
│   │   ├── globals.css           # Global stylesheet importer
│   │   ├── layout.tsx            # Root layout mounting persistent <DashboardApp />
│   │   └── page.tsx              # Home route entry point
│   ├── components/               # UI Components
│   │   ├── dashboard-app.tsx     # Master app shell, navigation router, timer controller
│   │   └── dashboard/
│   │       ├── contracts.ts      # Shared UI callback types
│   │       ├── earnings-chart.tsx# Earnings analytics chart & CSV export
│   │       ├── home-widgets.tsx  # KPI cards, quick actions, activity stream
│   │       ├── home.tsx          # Home dashboard layout composition
│   │       ├── ongoing-projects.tsx # Ongoing projects card widget
│   │       ├── pages/            # Distinct screens for each workspace section:
│   │       │   ├── accounting.tsx# Financial reports and ledger view
│   │       │   ├── balance.tsx   # Receivables and cash balance screen
│   │       │   ├── clients.tsx   # Client list, filtering, and detail modal
│   │       │   ├── documents.tsx # Document repository (proposals, contracts, forms)
│   │       │   ├── invoices.tsx  # Invoices listing, statuses, draft creation
│   │       │   ├── projects.tsx  # Engagements / projects table with status filter
│   │       │   ├── settings.tsx  # User & firm configuration
│   │       │   ├── taxes.tsx     # Tax overview & compliance tracker
│   │       │   └── time.tsx      # Time tracker session history & logger
│   │       ├── project-drawer.tsx# Sliding drawer for project details
│   │       ├── project-table.tsx # Reusable engagement table
│   │       ├── search.tsx        # Search modal & indexed query matcher
│   │       ├── sidebar.tsx       # Desktop & mobile responsive sidebar
│   │       ├── ui.tsx            # Badges, headings, filter chips, buttons
│   │       └── workspace-modal.tsx # Creation dialogs for clients, projects, invoices, docs
│   ├── data/
│   │   └── dashboard.ts          # Typed design fixtures matching Figma specification
│   ├── lib/                      # Client-side helpers, hooks, and adapters
│   │   ├── api-workspace-source.ts # REST implementation of WorkspaceSource
│   │   ├── dashboard-metrics.ts  # KPI calculation utilities
│   │   ├── format.ts             # Currency (INR), date (IST), and time formatting
│   │   ├── routes.ts             # Route registry, section metadata, and URL helper
│   │   ├── security-headers.ts   # HTTP security header generator
│   │   ├── storage-validation.ts # Runtime schema validation for localStorage JSON
│   │   ├── timer-state.ts        # Timer persistence logic and elapsed calculation
│   │   ├── use-dialog.ts         # Accessible modal dialog hook (focus trap & escape)
│   │   ├── use-timer.ts          # Running/stopped timer hook
│   │   ├── use-workspace.ts      # Workspace data query and mutation hook
│   │   └── workspace-source.ts   # Adapter factory and browser implementation
│   ├── server/                   # Server-only modules (database, auth, API business logic)
│   │   ├── http.ts               # Route wrapper with session check and error handling
│   │   ├── auth/
│   │   │   └── session.ts        # Session resolution, user lookup, dev identity stub
│   │   ├── db/
│   │   │   ├── client.ts         # Lazy Postgres pool singleton
│   │   │   ├── schema.ts         # Drizzle schema definitions (tables, relations, enums)
│   │   │   └── seed.ts           # Development database seeder from fixtures
│   │   ├── invitations/          # Firm invitation business logic, input schema, errors
│   │   └── workspace/            # Workspace service, input Zod schemas, data mappers
│   ├── styles/                   # Modular CSS stylesheets
│   │   ├── base.css              # Variables, reset, typography
│   │   ├── components.css        # Buttons, inputs, tables, cards
│   │   ├── dialogs.css           # Modals, drawers, toasts
│   │   ├── home.css              # Home grid and widget layouts
│   │   ├── pages.css             # Page-specific views (invoices, clients, time)
│   │   ├── responsive.css        # Breakpoints and mobile overrides
│   │   └── shell.css             # App container, sidebar, and header navigation
│   └── types/
│       └── workspace.ts          # Frontend data models and contracts
├── tests/
│   ├── client/                   # Frontend unit tests
│   ├── integration/              # Real PostgreSQL integration tests
│   ├── scripts/                  # Test execution harness (`run.mjs`)
│   └── server/                   # API boundary and validation tests
├── docker-compose.yml            # Local development PostgreSQL 17 configuration
├── drizzle.config.ts             # Drizzle Kit configuration
├── eslint.config.mjs             # ESLint 9 flat configuration
├── next.config.ts                # Next.js security headers & config
├── package.json                  # Dependencies & npm scripts
└── tsconfig.json                 # TypeScript compiler configuration
```
