# Release Process & Contributor Recognition Guide

OBLIQ-in follows automated, contributor-centric release practices inspired by top open-source projects like **Netflix Conductor OSS**. This guide explains how to draft, verify, and publish new releases.

---

## 1. Release Architecture & Tooling

Every release combines three automated layers:

1. **GitHub Native Release Notes (`.github/release.yml`)**:
   Automatically powers the **"Generate release notes"** button in GitHub's web interface, grouping merged pull requests into categorized sections and highlighting every contributor with their `@username`.
2. **Local Release Helper (`npm run release:notes`)**:
   Inspects git commit history between tags, computes author contribution counts, and generates formatted release notes directly in your terminal.
3. **Automated Release Pipeline (`.github/workflows/release.yml`)**:
   Gated by full quality checks (`npm run check`), automatically creates GitHub releases on tag pushes or via on-demand manual triggers.

---

## 2. Release Methods

### Method A: Creating a Release via the GitHub Web UI (Recommended for Interactive Editing)

1. Navigate to **Releases** on GitHub: `https://github.com/OBLIQ-in/obliq-in-app/releases`.
2. Click **Draft a new release**.
3. In **Choose a tag**:
   - Type the new version tag (e.g., `v0.2.0`) and select **Create new tag: v0.2.0 on main**.
4. In **Release title**:
   - Enter a descriptive title, e.g., `v0.2.0 — Dynamic CA Profile & Onboarding Experience`.
5. Click the **"Generate release notes"** button in the editor toolbar.
   - GitHub reads `.github/release.yml` and instantly auto-populates:
     - 🚀 **Features & Enhancements**
     - 🐛 **Bug Fixes & Reliability**
     - 🛡️ **Security & Backend Architecture**
     - 📚 **Documentation & Community**
     - ⚙️ **CI, Tooling & Automation**
     - 👥 **Contributor Mentions**: Each PR line lists `by @contributor in #pr`.
     - 🎉 **New Contributors**: First-time contributors are highlighted automatically.
6. Add an executive **🌟 Overview** paragraph summarizing key benefits for CA practitioners.
7. Click **Publish release** (or **Save draft** to review with the team).

---

### Method B: Automated Release via GitHub Actions (`workflow_dispatch`)

1. Go to the **Actions** tab on GitHub: `https://github.com/OBLIQ-in/obliq-in-app/actions/workflows/release.yml`.
2. Select **Release** from the workflow sidebar.
3. Click **Run workflow**:
   - **Version tag**: Enter the target tag, e.g., `v0.2.0`.
   - **Create as draft release**: Check this to create a draft first for review.
   - **Mark as prerelease**: Optional (for alpha/beta releases).
4. Click **Run workflow**:
   - The workflow runs full quality verification (`npm run check`): formatting, linting, typechecking, 49 unit tests, and production Next.js build.
   - Once verified, it executes `.github/scripts/generate-release-notes.mjs`, tags the commit, and publishes the release.

---

### Method C: Tag-Triggered Automated Release

If you prefer using the Git CLI directly:

```bash
# Ensure main branch is up to date and clean
git checkout main
git pull origin main

# Run local quality verification
npm run check

# Create an annotated semantic tag
git tag -a v0.2.0 -m "Release v0.2.0"

# Push the tag to GitHub
git push origin v0.2.0
```

GitHub Actions will automatically detect the `v*` tag push, verify code quality, generate the changelog, and publish the release.

---

## 3. Local Preview Helper (`release:notes`)

To preview the release changelog and contributor spotlight in your terminal before cutting a release:

```bash
# Preview upcoming release notes based on commits since last tag
npm run release:notes

# Specify a custom version tag
node .github/scripts/generate-release-notes.mjs --tag v0.2.0

# Save release notes to a markdown file
node .github/scripts/generate-release-notes.mjs --tag v0.2.0 --output release-notes.md
```

---

## 4. Contributor Recognition Principles

Recognizing open-source contributors is a core value in OBLIQ-in:

- **Every contributor matters**: Whether fixing a typo in documentation, hardening multi-tenant security, or building frontend UI, every author is credited.
- **First-time contributors spotlight**: The `🎉 New Contributors` section highlights first-time contributors with their PR links.
- **Maintainer attribution**: Maintainers reviewing and shepherding PRs should ensure PR titles adhere to Conventional Commits so that changelogs remain organized and readable.
