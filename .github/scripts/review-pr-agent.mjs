// High-Level AI PR Review Agent for OBLIQ-in powered by Google Gemini API
import process from "node:process";

const { GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER } =
  process.env;

if (!GEMINI_API_KEY) {
  console.log(
    "Notice: GEMINI_API_KEY secret is not configured. Skipping automated AI review.",
  );
  process.exit(0);
}

if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !PR_NUMBER) {
  console.error("Missing required GitHub environment variables.");
  process.exit(1);
}

const GITHUB_API_URL = "https://api.github.com";

async function githubRequest(path, options = {}) {
  const url = `${GITHUB_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "obliq-pr-review-agent",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GitHub API error (${response.status} ${response.statusText}): ${errorBody}`,
    );
  }

  return response;
}

async function getPullRequest() {
  const res = await githubRequest(
    `/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}`,
    {
      headers: { Accept: "application/vnd.github.v3+json" },
    },
  );
  return res.json();
}

async function getPullRequestDiff() {
  const res = await githubRequest(
    `/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}`,
    {
      headers: { Accept: "application/vnd.github.v3.diff" },
    },
  );
  return res.text();
}

async function postComment(body) {
  await githubRequest(
    `/repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
}

async function addLabels(labels) {
  if (!labels || labels.length === 0) return;
  await githubRequest(
    `/repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/labels`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labels }),
    },
  );
}

async function removeLabel(label) {
  try {
    await githubRequest(
      `/repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/labels/${encodeURIComponent(label)}`,
      { method: "DELETE" },
    );
  } catch (err) {
    console.warn(`Could not remove label ${label}:`, err.message);
  }
}

async function callGemini(prompt) {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2500,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await res.text();
        console.warn(`Model ${model} returned ${res.status}: ${errText}`);
      }
    } catch (err) {
      console.warn(`Failed call to ${model}:`, err.message);
    }
  }

  throw new Error("All Gemini model generation attempts failed.");
}

async function run() {
  console.log(`Analyzing PR #${PR_NUMBER} in ${GITHUB_REPOSITORY}...`);

  const pr = await getPullRequest();
  const diffRaw = await getPullRequestDiff();

  // Truncate diff to ~35,000 characters to stay lightweight and within free-tier limits
  const maxDiffLength = 35000;
  const isTruncated = diffRaw.length > maxDiffLength;
  const diff = isTruncated
    ? `${diffRaw.slice(0, maxDiffLength)}\n\n[... Diff truncated for review brevity ...]`
    : diffRaw;

  const currentLabels = pr.labels ? pr.labels.map((l) => l.name) : [];

  const prompt = `You are the High-Level AI Review Agent for OBLIQ-in (obliq-in-app).
OBLIQ-in is an open-source, private Chartered Accountant (CA) firm workspace in India managing clients, tax audits, GST records, invoices, and financial documents.

Your role is to perform a HIGH-LEVEL architectural, security, and impact review of the Pull Request.
Do NOT perform line-by-line nitpicking on trivial formatting or style issues (ESLint and Prettier handle those).

Core Review Invariants:
1. Multi-Tenant Isolation: Every database query in server services must strictly scope by \`session.firmId\`. Reject any PR that blindly trusts \`firmId\` or \`userId\` from client request parameters.
2. Financial Data Privacy: Real Indian tax identifiers (PAN, GSTIN), real bank accounts, or real client financials must NEVER be committed. Only synthetic mock data is permitted.
3. Server vs Client Boundaries: Server-only code must include \`import "server-only";\`. Client components must have \`"use client";\`.
4. Architecture & Styling: Next.js 15 App Router conventions, Drizzle ORM schema integrity, and Vanilla CSS. No unsolicited CSS frameworks (e.g. Tailwind) unless explicitly requested.
5. CA Domain Review: If the PR changes tax calculations, invoice structures, audit approval roles, or Indian statutory compliance, it must carry the \`needs-ca-review\` label.

Pull Request Context:
- Title: ${pr.title}
- Description: ${pr.body || "No description provided."}
- Author: ${pr.user?.login}
- Base Branch: ${pr.base?.ref}
- Head Branch: ${pr.head?.ref}
- Current Labels: ${currentLabels.join(", ") || "None"}

Pull Request Diff:
\`\`\`diff
${diff}
\`\`\`

Instructions:
1. Output a structured Markdown review.
2. Structure:
   ### 🤖 OBLIQ-in AI High-Level PR Review
   **Verdict**: [One of: ✅ Looks Good / ⚠️ Action Required / 🛑 Critical Architectural Concerns]

   #### 1. High-Level Summary & Intent
   (1-2 sentences on what this PR introduces)

   #### 2. Architectural & System Impact
   (Analysis of data flow, components, potential regressions, or breaking changes)

   #### 3. Security, Multi-Tenancy & Data Isolation
   (Check firmId scoping, PAN/GSTIN privacy, secrets)

   #### 4. CA Domain & Compliance Check
   (Check whether this PR impacts tax/audit logic and if practicing CA sign-off is needed)

3. AT THE VERY END OF YOUR RESPONSE, provide a JSON block on a new line enclosed in \`\`\`json ... \`\`\` specifying any label adjustments needed (ONLY if needed, otherwise set addLabels to []):
\`\`\`json
{
  "addLabels": ["needs-ca-review"],
  "removeLabels": []
}
\`\`\`
If no label adjustments are necessary, provide:
\`\`\`json
{
  "addLabels": [],
  "removeLabels": []
}
\`\`\`
`;

  console.log("Requesting review from Gemini API...");
  const aiResponse = await callGemini(prompt);

  // Parse out label metadata from JSON block if present
  let cleanReview = aiResponse;
  let labelUpdates = { addLabels: [], removeLabels: [] };

  const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      labelUpdates = JSON.parse(jsonMatch[1]);
      // Remove JSON block from final user comment for clean presentation
      cleanReview = aiResponse.replace(/```json\s*[\s\S]*?\s*```/, "").trim();
    } catch (e) {
      console.warn(
        "Could not parse label metadata JSON from AI response:",
        e.message,
      );
    }
  }

  // Post comment to PR
  console.log("Posting review comment to PR...");
  await postComment(cleanReview);

  // Apply label updates if required
  if (labelUpdates.addLabels && labelUpdates.addLabels.length > 0) {
    const labelsToAdd = labelUpdates.addLabels.filter(
      (l) => !currentLabels.includes(l),
    );
    if (labelsToAdd.length > 0) {
      console.log(`Adding labels: ${labelsToAdd.join(", ")}`);
      await addLabels(labelsToAdd);
    }
  }

  if (labelUpdates.removeLabels && labelUpdates.removeLabels.length > 0) {
    for (const label of labelUpdates.removeLabels) {
      if (currentLabels.includes(label)) {
        console.log(`Removing label: ${label}`);
        await removeLabel(label);
      }
    }
  }

  console.log("PR review completed successfully.");
}

run().catch((err) => {
  console.error("AI PR Review Agent encountered an error:", err);
  // Do not fail the workflow if AI review fails (e.g. rate limit), keep build green
  process.exit(0);
});
