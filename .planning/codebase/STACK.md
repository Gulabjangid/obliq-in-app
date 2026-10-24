# Tech Stack

## Runtime & Engines
- **Node.js**: `>= 22.18.0` (Enforced in [package.json](file:///e:/Open%20Source/Obliq-in-app/package.json#L25-L27))
- **Module System**: ESM (`"type": "module"`)
- **Package Manager**: npm (`package-lock.json` lockfile v3)

## Core Frameworks & Libraries
- **Framework**: [Next.js](https://nextjs.org/) `15.5.27` (App Router)
- **UI Library**: [React](https://react.dev/) `19.1.0` / React DOM `19.1.0`
- **Iconography**: [lucide-react](https://lucide.dev/) `^0.468.0`
- **Validation**: [zod](https://zod.dev/) `^4.6.5` (API payload parsing and query boundaries)
- **Utilities**: `server-only` `^0.0.1` (Prevents server code leakage into client bundles)

## Database & ORM
- **Database Engine**: PostgreSQL 15+ (Postgres 17-alpine in Docker and CI)
- **Driver**: `postgres` (`^3.4.9`)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) `^0.45.3`
- **Migration & Studio Tooling**: `drizzle-kit` `^0.31.11`
- **Migration Path**: `drizzle/*.sql` (Generated via `npm run db:generate`, applied via `npm run db:migrate`)

## Styling & Layout
- **Paradigm**: Vanilla CSS / Modular stylesheets (No Tailwind CSS by design)
- **Directory**: `src/styles/` (`base.css`, `components.css`, `dialogs.css`, `home.css`, `pages.css`, `responsive.css`, `shell.css`)
- **Tokens & Reset**: CSS Custom Properties (`--bg`, `--border`, `--text`, `--accent`, etc.) defined in `src/styles/base.css`

## Quality, Linting & Formatting
- **TypeScript**: `^5.0.0` with strict checks enabled in [tsconfig.json](file:///e:/Open%20Source/Obliq-in-app/tsconfig.json)
- **Linter**: ESLint `^9.0.0` (`@eslint/eslintrc`, `eslint-config-next`, `eslint-config-prettier`)
- **Formatter**: Prettier `^3.9.9` (80 cols, double quotes, trailing commas)
- **Git Hooks**: Husky `^9.0.0` + `lint-staged` `^16.0.0` (runs formatting, linting, typechecking, and tests pre-commit)

## Testing Framework
- **Test Runner**: Node.js built-in test runner (`node:test`, `node:test/reporters`)
- **Orchestration Script**: `tests/scripts/run.mjs` (parallel execution based on available CPU cores)
- **Test Suites**: Client unit tests, Server unit tests, and PostgreSQL integration tests (`tests/integration/`)
