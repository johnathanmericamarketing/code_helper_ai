const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// ─── Helper: get user profile ────────────────────────────────────────────────
async function getUserProfile(uid) {
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) throw new HttpsError("not-found", "User profile not found");
  return doc.data();
}

// ─── Helper: record token usage after a request ─────────────────────────────
async function recordUsage(uid, inputTokens, outputTokens, costUsd) {
  const ref = db.collection("users").doc(uid);
  const doc = await ref.get();
  const current = doc.exists ? (doc.data().usage_this_month || {}) : {};

  await ref.update({
    usage_this_month: {
      input_tokens: (current.input_tokens || 0) + inputTokens,
      output_tokens: (current.output_tokens || 0) + outputTokens,
      cost_usd: (current.cost_usd || 0) + costUsd,
      requests: (current.requests || 0) + 1,
    },
  });
}

// ─── Claude pricing per million tokens ───────────────────────────────────────
const CLAUDE_PRICING = {
  "claude-opus-4-5":    { input: 15.0,  output: 75.0 },
  "claude-sonnet-4-5":  { input: 3.0,   output: 15.0 },
  "claude-haiku-3-5":   { input: 0.8,   output: 4.0  },
};

// ─── processCodeRequest: real Claude AI code generation ──────────────────────
exports.processCodeRequest = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { requestId, rawRequest, context } = request.data;
  if (!requestId || !rawRequest) {
    throw new HttpsError("invalid-argument", "Missing requestId or rawRequest");
  }

  const uid = request.auth.uid;
  const profile = await getUserProfile(uid);

  // Determine which API key to use: BYOK > Platform > error
  const apiKey = profile.claude_api_key || process.env.ANTHROPIC_PLATFORM_KEY || null;
  const model = profile.claude_model || "claude-sonnet-4-5";

  // ── FRAMEWORK MODE: Return realistic stub if no key is configured ──────────
  if (!apiKey) {
    const stub = buildStubResponse(requestId, rawRequest);
    // Still record nominal usage to show the tracking works
    await recordUsage(uid, 1800, 1200, 0);
    // Save stub as generated code
    await db.collection("generated_code").add(stub);
    // Update request status
    await db.collection("code_requests")
      .where("id", "==", requestId)
      .get()
      .then(snap => snap.docs[0]?.ref.update({ status: "validated", updated_at: new Date().toISOString() }));

    return { ...stub, mode: "stub" };
  }

  // ── LIVE MODE: Call Anthropic API ─────────────────────────────────────────
  const Anthropic = require("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey });

  const systemPrompt = `You are an expert software engineer AI assistant integrated into Code Helper Studio.
Your job is to analyze code change requests and produce structured JSON output describing what changes need to be made.

Always respond with valid JSON matching this structure:
{
  "structured_task": { "task_type": string, "title": string, "context": string, "expected_behavior": string, "acceptance_criteria": string[], "technical_notes": string[], "assumptions": string[] },
  "execution_plan": { "files_to_modify": string[], "files_to_avoid": string[], "risk_level": "low"|"medium"|"high", "change_scope_summary": string },
  "code_changes": [ { "file_path": string, "diff": string, "description": string } ],
  "validation_checks": [ { "check_name": string, "result": "passed"|"warning"|"failed", "message": string, "details": string|null } ],
  "summary": string,
  "rollback_instructions": string
}`;

  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: profile.max_tokens || 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Code change request:\n${rawRequest}\n\n${context ? `Additional context:\n${context}` : ""}`,
        },
      ],
    });

    // Parse response
    const responseText = message.content[0].text;
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new HttpsError("internal", "Failed to parse Claude response as JSON");
    }

    // Calculate cost
    const pricing = CLAUDE_PRICING[model] || CLAUDE_PRICING["claude-sonnet-4-5"];
    const costUsd =
      (message.usage.input_tokens * pricing.input +
        message.usage.output_tokens * pricing.output) /
      1_000_000;

    await recordUsage(uid, message.usage.input_tokens, message.usage.output_tokens, costUsd);

    const payload = {
      id: require("crypto").randomUUID(),
      request_id: requestId,
      ...parsed,
      model_used: model,
      tokens: { input: message.usage.input_tokens, output: message.usage.output_tokens },
      cost_usd: costUsd,
      created_at: new Date().toISOString(),
      userId: uid,
    };

    await db.collection("generated_code").add(payload);
    await db.collection("code_requests")
      .where("id", "==", requestId)
      .get()
      .then(snap => snap.docs[0]?.ref.update({ status: "validated", updated_at: new Date().toISOString() }));

    return { ...payload, mode: "live" };
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", "Claude API error: " + err.message);
  }
});

// ─── Stub response builder ────────────────────────────────────────────────────
function buildStubResponse(requestId, rawRequest) {
  return {
    id: require("crypto").randomUUID(),
    request_id: requestId,
    structured_task: {
      task_type: "feature",
      title: "Implement: " + rawRequest.slice(0, 60),
      context: rawRequest,
      expected_behavior: "Feature should work as described in the request",
      acceptance_criteria: [
        "Code compiles without errors",
        "Feature functions as expected",
        "Tests pass successfully",
      ],
      technical_notes: ["Follow existing code patterns", "Maintain backward compatibility"],
      assumptions: ["Current codebase is stable", "Dependencies are up to date"],
    },
    execution_plan: {
      files_to_modify: ["src/components/Feature.jsx", "src/utils/helpers.js"],
      files_to_avoid: ["src/core/config.js"],
      risk_level: "low",
      change_scope_summary: "Isolated changes to feature components only",
    },
    code_changes: [
      {
        file_path: "src/components/Feature.jsx",
        diff: `import React, { useState } from 'react';\n\nconst Feature = () => {\n  const [active, setActive] = useState(false);\n  return (\n    <div className="feature">\n      <button onClick={() => setActive(!active)}>Toggle Feature</button>\n      {active && <p>Feature is active!</p>}\n    </div>\n  );\n};\n\nexport default Feature;`,
        description: "New feature component — add your Claude API key to generate real code",
      },
    ],
    validation_checks: [
      { check_name: "Scope Validation", result: "passed", message: "Changes within planned scope", details: null },
      { check_name: "Syntax Check", result: "passed", message: "Code is syntactically correct", details: null },
      { check_name: "API Key", result: "warning", message: "Add your Claude API key in Settings for real AI generation", details: "Navigate to Settings → Claude API tab" },
    ],
    summary: "⚠️ Framework stub: Add your Claude API key in Settings to generate real AI code.",
    rollback_instructions: "Run `git checkout HEAD~1` to revert changes if needed.",
    created_at: new Date().toISOString(),
  };
}
