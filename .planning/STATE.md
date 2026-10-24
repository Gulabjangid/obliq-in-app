# Project State

## Current Position
- **Project**: OBLIQ-in (Dashboard & CA Workspace)
- **Status**: Codebase successfully mapped and new project initialized.
- **Active Milestone**: Milestone 1 (Core Foundation & Team Workspace)
- **Active Phase**: Ready to start Phase 1 (Authentication & User Onboarding) or Phase 2 (Team Invitation UI) based on priority.

## Baseline Metrics & Codebase Health
- **Linting & Formatting**: Passing (ESLint 9 + Prettier 3)
- **Type Checking**: Passing (TypeScript 5 strict mode)
- **Unit & Integration Tests**:
  - Non-database suite (`npm test`): 7 client & server test files active
  - Database integration suite (`npm run test:db`): Passing with disposable PostgreSQL
- **Backend Infrastructure**: Drizzle ORM migrations (0000_init, 0001_firm_invitations) active, multi-tenant session isolation foundation established.

## Key Decisions Log
1. **Persistent Dashboard Architecture**: Chose root layout mounting of `<DashboardApp />` to guarantee timer and session continuity without third-party global state stores.
2. **Dual-Mode Adapter**: Maintained `WorkspaceSource` abstraction with `NEXT_PUBLIC_WORKSPACE_SOURCE` allowing seamless switching between local browser preview and backend Postgres.
3. **Decoupled User Identity**: Separated `user_identities` from `users` to future-proof authentication providers (Auth0 now, custom credentials/SAML later).
4. **Hashed Invitation Codes**: Enforced SHA-256 code hashing for firm invitation tokens with transactional row locking on redemption.

## Next Step
- Run `/gsd-plan-phase 1` (or `/gsd-plan-phase 2` for Team Invitation UI) to begin execution.
