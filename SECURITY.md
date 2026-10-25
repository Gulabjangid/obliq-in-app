# Security Policy

OBLIQ-in is a workspace designed for Chartered Accountant (CA) firms and their clients, managing sensitive financial statements, tax records, and client records. We take security, tenant isolation, and data confidentiality seriously.

## Supported Versions

Only the latest release on the `main` branch receives active security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

If you believe you have discovered a security vulnerability in OBLIQ-in, please report it privately:

1. **GitHub Private Vulnerability Reporting (Preferred)**:
   Submit an advisory through [GitHub Security Advisories](https://github.com/OBLIQ-in/obliq-in-app/security/advisories/new).
2. **Email**:
   Send details directly to **security@obliq.in** or contact the repository maintainers.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please include:

- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Affected endpoints, components, or files.
- Any suggested remediations or mitigations if known.

> [!CAUTION]
> **Synthetic Data Only**: When creating a Proof of Concept (PoC) or reproduction steps, **strictly use synthetic data**. Never include real taxpayer identification numbers (PAN, GSTIN), real client financial books, or live credentials.

## Response Timeline & SLA

- **Acknowledgment**: Within 48 hours of receipt.
- **Triage & Assessment**: Within 5 business days.
- **Remediation & Patching**: Security patches are prioritized according to severity (P0/P1), with coordinated disclosure following deployment.

## Priority Focus Areas

We specifically encourage review and auditing in the following security domains:

- **Tenant Isolation**: Bypassing firm boundaries (`session.firmId`) to view, modify, or export another firm's clients, projects, or documents.
- **Role Escalation**: Performing owner-level actions (e.g., issuing invitations, firm deletion) from an `article_assistant` or unauthenticated session.
- **Token Security**: Cryptographic weaknesses in firm invitation generation, hashing (SHA-256), or concurrent redemption serialization.
- **Client Document Privacy**: Unauthorized access to client-uploaded invoices, challans, or source documents.

## Safe Harbor

We consider security research conducted under this policy to be authorized. We will not pursue legal action against researchers who:

- Make a good faith effort to avoid privacy violations, data destruction, and service interruption.
- Give us reasonable time to remediate the vulnerability before public disclosure.
- Do not access, retain, or share another user's or firm's confidential data.
