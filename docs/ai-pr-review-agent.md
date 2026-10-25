# AI PR Review Agent

OBLIQ-in uses an automated AI review assistant powered by Google Gemini (`gemini-2.5-flash`) to review incoming pull requests.

## Purpose & Scope

The agent acts as a **high-level architectural and domain reviewer**. It does not perform cosmetic line-by-line linting (which is already enforced by ESLint and Prettier in CI); instead, it evaluates systemic impact, security boundaries, and CA domain requirements:

1. **Multi-Tenant Isolation**: Verifies that backend queries in services strictly filter by `session.firmId` and rejects unauthenticated client-supplied tenant identifiers.
2. **Financial Data Privacy**: Scans the diff for accidental inclusion of real Indian tax identifiers (PAN, GSTIN), real bank accounts, or real client financial records (enforcing the synthetic-only rule in [CONTRIBUTING.md](../CONTRIBUTING.md)).
3. **Architecture & Boundaries**: Asserts `import "server-only";` on backend files, Next.js 15 App Router conventions, and modular Vanilla CSS styling.
4. **CA Domain Sign-Off**: Detects changes impacting tax computation, GST filing rules, invoice structures, or statutory audit workflows and tags the PR with `needs-ca-review`.

## Trigger Lifecycle & Quota Optimization

To protect free-tier API quotas and avoid noise:

- **Execution Event**: `pull_request_target: types: [opened]`
- **Single Run**: The agent fires **strictly once** when a PR is first opened. It does not run on every subsequent commit push (`synchronize`).
- **Drafts Ignored**: Draft pull requests are skipped until marked ready for review.
- **Fail-Safe**: If the API call fails or encounters a rate limit, the step exits cleanly without failing CI.

## Conditional Label Management

The agent inspects the pull request context and manages labels **only when necessary**:

- Automatically attaches `needs-ca-review` if the PR alters Indian tax rules, GST calculation, invoice generation, or audit schemas.
- If current labels are appropriate, label manipulation is completely suspended.

## Configuration & Repository Secrets

The agent requires a Google Gemini API key configured in repository secrets:

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In the repository settings on GitHub, navigate to **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
3. Create a secret named **`GEMINI_API_KEY`** with your key value.

If `GEMINI_API_KEY` is not configured, the workflow gracefully skips the review step without error.
