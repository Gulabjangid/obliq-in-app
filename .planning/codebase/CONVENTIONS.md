# Coding Conventions & Standards

## Code Style & Formatting

- **Prettier Settings**:
  - Double quotes (`"`)
  - Semicolons enforced
  - Trailing commas in multi-line objects/arrays
  - Tab width: 2 spaces
- **ESLint**:
  - ESLint 9 Flat Config ([eslint.config.mjs](file:///e:/Open%20Source/Obliq-in-app/eslint.config.mjs))
  - Zero warnings allowed (`eslint . --max-warnings 0`)

## TypeScript Conventions

- **Strict Mode**: Enabled in [tsconfig.json](file:///e:/Open%20Source/Obliq-in-app/tsconfig.json).
- **Import Extensions**: Relative imports specify `.ts` or `.tsx` where necessary for modern ESM module resolution.
- **Path Aliases**: `@/*` maps to `./src/*`.
- **Runtime Validation**: Use Zod for parsing external boundaries (API payloads, query params) and explicit type guard functions for local storage (`isType` guards in `storage-validation.ts`).

## Server vs. Client Boundary Rules

- **Server Guard**: All server-side files in `src/server/` **must** include:
  ```ts
  import "server-only";
  ```
  Importing any server file into client code will intentionally trigger a Next.js compile-time error.
- **Client Components**: Any component utilizing React hooks (`useState`, `useEffect`), browser APIs (`window.localStorage`), or event handlers must declare `"use client";` as the first line.

## Multi-Tenancy & Authorization Invariants

- **Firm Isolation**: Every database query in service functions must be filtered by `session.firmId`.
- **Session Identity**: Trust only the authenticated session resolved via `getSession()`. Never extract `firm_id` or `user_id` from unauthenticated client input bodies.
- **Role Verification**: Owner actions (invitations, firm settings) must re-verify the caller's membership and role directly from the database rather than trusting cached or client-provided role claims.

## CSS & UI Architecture

- **Vanilla CSS**: Tailwind CSS is explicitly avoided in favor of modular vanilla stylesheets (`src/styles/*.css`).
- **Responsive Media Queries**: Screen breakpoint overrides (`@media (max-width: ...)`) must be co-located in [src/styles/responsive.css](file:///e:/Open%20Source/Obliq-in-app/src/styles/responsive.css).
- **Design Tokens**: Standardize colors, font weights, shadows, and radii using CSS custom properties defined in `base.css`.
- **Formatting in JSX**: Keep business formatting (currency, timestamps, durations) inside pure helper functions in [src/lib/format.ts](file:///e:/Open%20Source/Obliq-in-app/src/lib/format.ts).

## Git & PR Workflow

- **Branch Naming**: Must start with a prefix: `feat/`, `fix/`, `docs/`, `test/`, `chore/`. Never PR directly from a fork's `main`.
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
  - Example: `feat: implement client upload drawer`
  - Example: `fix: resolve invitation expiry validation`
- **Data Privacy**: Strictly use synthetic test data. Never commit real Indian tax identifiers (PAN, GSTIN), real client names, or financial statements.
