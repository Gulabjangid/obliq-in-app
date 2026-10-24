#!/usr/bin/env node
// Automated Release Notes and Contributor Spotlight Generator for OBLIQ-in
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

function runGit(command) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function getPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    return pkg.version ? `v${pkg.version}` : "v0.1.0";
  } catch {
    return "v0.1.0";
  }
}

function getLatestTag() {
  const tagsRaw = runGit("git tag --sort=-v:refname");
  if (!tagsRaw) return "";
  const tags = tagsRaw
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  return tags[0] || "";
}

function getInitialCommit() {
  return runGit("git rev-list --max-parents=0 HEAD") || "HEAD";
}

function parseCommits(range) {
  const format = "%H%x09%an%x09%ae%x09%s";
  const raw = runGit(
    `git log ${range} --pretty=format:"${format}" --no-merges`,
  );
  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, author, email, subject] = line.split("\t");
      return { hash, author, email, subject };
    });
}

function categorizeCommit(subject) {
  const normalized = subject.trim().toLowerCase();
  if (normalized.startsWith("feat")) return "features";
  if (normalized.startsWith("fix")) return "fixes";
  if (normalized.startsWith("security") || normalized.startsWith("sec"))
    return "security";
  if (normalized.startsWith("docs")) return "docs";
  return "tooling";
}

function formatCommitLine(commit) {
  // Extract PR number if present e.g. #91 or (#91)
  const prMatch = commit.subject.match(/#(\d+)/);
  const prPart = prMatch ? ` in #${prMatch[1]}` : "";
  const cleanSubject = commit.subject.replace(/\s*\(#\d+\)\s*$/, "").trim();
  return `- ${cleanSubject} by ${commit.author}${prPart} (\`${commit.hash.slice(0, 7)}\`)`;
}

export function generateReleaseNotes(options = {}) {
  const currentTag = options.tag || getPackageVersion();
  const previousTag = options.since || getLatestTag();
  const range = previousTag
    ? `${previousTag}..HEAD`
    : `${getInitialCommit()}..HEAD`;

  console.log(
    `[Release Notes] Generating notes for ${currentTag} (range: ${range})...`,
  );

  const commits = parseCommits(range);
  const categories = {
    features: [],
    fixes: [],
    security: [],
    docs: [],
    tooling: [],
  };

  const contributors = new Map();

  for (const commit of commits) {
    // Filter bot noise
    if (
      commit.author.toLowerCase().includes("dependabot") ||
      commit.author.toLowerCase().includes("github-actions")
    ) {
      continue;
    }

    const cat = categorizeCommit(commit.subject);
    categories[cat].push(commit);

    const count = contributors.get(commit.author) || 0;
    contributors.set(commit.author, count + 1);
  }

  const sections = [];

  sections.push(`# Release ${currentTag}`);
  sections.push("");
  sections.push("## 🌟 Overview");
  sections.push(
    `This release brings dynamic practitioner personalization, workspace quality hardening, and community workflow enhancements to the OBLIQ CA firm platform.`,
  );
  sections.push("");

  if (categories.features.length > 0) {
    sections.push("## 🚀 Features & Enhancements");
    sections.push(...categories.features.map(formatCommitLine));
    sections.push("");
  }

  if (categories.fixes.length > 0) {
    sections.push("## 🐛 Bug Fixes & Reliability");
    sections.push(...categories.fixes.map(formatCommitLine));
    sections.push("");
  }

  if (categories.security.length > 0) {
    sections.push("## 🛡️ Security & Backend Architecture");
    sections.push(...categories.security.map(formatCommitLine));
    sections.push("");
  }

  if (categories.docs.length > 0) {
    sections.push("## 📚 Documentation & Community");
    sections.push(...categories.docs.map(formatCommitLine));
    sections.push("");
  }

  if (categories.tooling.length > 0) {
    sections.push("## ⚙️ CI, Tooling & Automation");
    sections.push(...categories.tooling.map(formatCommitLine));
    sections.push("");
  }

  // Contributor Spotlight
  sections.push("---");
  sections.push("");
  sections.push("## 👥 Contributor Spotlight");
  sections.push(
    "Heartfelt thanks to everyone contributing code, documentation, and reviews to this release:",
  );
  sections.push("");

  if (contributors.size === 0) {
    sections.push("- Core Maintainers & OBLIQ Community");
  } else {
    for (const [author, count] of contributors.entries()) {
      const commitLabel = count === 1 ? "1 commit" : `${count} commits`;
      sections.push(`- **${author}** (${commitLabel})`);
    }
  }
  sections.push("");

  // Changelog comparison link
  if (previousTag) {
    sections.push(
      `**Full Changelog**: https://github.com/OBLIQ-in/obliq-in-app/compare/${previousTag}...${currentTag}`,
    );
  } else {
    sections.push(
      `**Commits**: https://github.com/OBLIQ-in/obliq-in-app/commits/${currentTag}`,
    );
  }
  sections.push("");

  return sections.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tag" && args[i + 1]) options.tag = args[++i];
    if (args[i] === "--since" && args[i + 1]) options.since = args[++i];
    if (args[i] === "--output" && args[i + 1]) options.output = args[++i];
    if (args[i] === "--preview") options.preview = true;
  }

  const markdown = generateReleaseNotes(options);

  if (options.output) {
    writeFileSync(options.output, markdown, "utf8");
    console.log(`[Release Notes] Successfully written to ${options.output}`);
  } else {
    console.log("\n" + markdown);
  }
}

if (process.argv[1]?.endsWith("generate-release-notes.mjs")) {
  main();
}
