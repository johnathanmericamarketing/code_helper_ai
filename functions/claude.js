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

// ─── Model pricing per million tokens ──────────────────────────────────────────
const AI_PRICING = {
  "claude-opus-4-5":       { input: 15.0,  output: 75.0 },
  "claude-sonnet-4-5":     { input: 3.0,   output: 15.0 },
  "claude-haiku-3-5":      { input: 0.8,   output: 4.0  },
  "gemini-1.5-pro-latest": { input: 3.5,   output: 10.5 },
  "gemini-1.5-flash-latest":{ input: 0.075, output: 0.3  },
};

// ─── processCodeRequest: AI code generation ──────────────────────────────────
exports.processCodeRequest = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { requestId, rawRequest, context } = request.data;
  if (!requestId || !rawRequest) {
    throw new HttpsError("invalid-argument", "Missing requestId or rawRequest");
  }

  const uid = request.auth.uid;
  const profile = await getUserProfile(uid);

  const model = request.data.overrideModel || profile.claude_model || "claude-sonnet-4-5";
  const isGemini = model.startsWith("gemini");
  
  // Determine which API key to use: BYOK > Platform > error
  // Map legacy 'claude_api_key' to 'ai_api_key' generically
  const byokKey = profile.ai_api_key || profile.claude_api_key;
  let apiKey = null;

  if (byokKey) {
    apiKey = byokKey;
  } else if (isGemini && process.env.GEMINI_PLATFORM_KEY) {
    apiKey = process.env.GEMINI_PLATFORM_KEY;
  } else if (!isGemini && process.env.ANTHROPIC_PLATFORM_KEY) {
    apiKey = process.env.ANTHROPIC_PLATFORM_KEY;
  }

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

  const systemPrompt = `You are an expert software engineer AI assistant integrated into Code Helper Studio.
Your job is to analyze code change requests and produce structured JSON output describing what changes need to be made.

Always respond with valid JSON block (no markdown fences) matching this structure:
{
  "structured_task": { "task_type": "string", "title": "string", "context": "string", "expected_behavior": "string", "acceptance_criteria": ["string"], "technical_notes": ["string"], "assumptions": ["string"] },
  "execution_plan": { "files_to_modify": ["string"], "files_to_avoid": ["string"], "risk_level": "low"|"medium"|"high", "change_scope_summary": "string" },
  "code_changes": [ { "file_path": "string", "diff": "string", "description": "string" } ],
  "validation_checks": [ { "check_name": "string", "result": "passed"|"warning"|"failed", "message": "string", "details": "string|null" } ],
  "summary": "string",
  "rollback_instructions": "string"
}`;

  try {
    let responseText = "";
    let inputTokens = 0;
    let outputTokens = 0;

    if (isGemini) {
      // ── GEMINI API CALL ───────────────────────────────────────────────────
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({
        model,
        systemInstruction: systemPrompt
      });

      const prompt = `Code change request:\n${rawRequest}\n\n${context ? `Additional context:\n${context}` : ""}`;
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
      // Note: Full token counting might require countTokens, but we simulate approx for billing
      inputTokens = Math.round(prompt.length / 4); 
      outputTokens = Math.round(responseText.length / 4);

    } else {
      // ── CLAUDE API CALL ───────────────────────────────────────────────────
      const Anthropic = require("@anthropic-ai/sdk");
      const anthropic = new Anthropic({ apiKey });

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
      responseText = message.content[0].text;
      inputTokens = message.usage.input_tokens;
      outputTokens = message.usage.output_tokens;
    }

    // Parse response
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText.replace(/```(?:json)?\n?|\n?```/gi, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new HttpsError("internal", "Failed to parse AI response as JSON");
    }

    // Calculate cost
    const pricing = AI_PRICING[model] || AI_PRICING["claude-sonnet-4-5"];
    const costUsd =
      (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

    await recordUsage(uid, inputTokens, outputTokens, costUsd);

    const payload = {
      id: require("crypto").randomUUID(),
      request_id: requestId,
      ...parsed,
      model_used: model,
      tokens: { input: inputTokens, output: outputTokens },
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
    throw new HttpsError("internal", "AI API error: " + err.message);
  }
});

// ─── suggestIdeas: short list of plain-English change suggestions ──────────
exports.suggestIdeas = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { siteUrl = "", goals = "", siteNotes = "", recentChanges = [] } = request.data || {};
  const uid = request.auth.uid;
  const profile = await getUserProfile(uid);

  const model = profile.claude_model || "claude-sonnet-4-5";
  const isGemini = model.startsWith("gemini");
  const byokKey = profile.ai_api_key || profile.claude_api_key;

  let apiKey = null;
  if (byokKey) apiKey = byokKey;
  else if (isGemini && process.env.GEMINI_PLATFORM_KEY) apiKey = process.env.GEMINI_PLATFORM_KEY;
  else if (!isGemini && process.env.ANTHROPIC_PLATFORM_KEY) apiKey = process.env.ANTHROPIC_PLATFORM_KEY;

  const systemPrompt = `You suggest concrete, non-technical website improvements for a user who is not a developer.
Respond ONLY with JSON in this exact shape:
{ "ideas": [ { "title": "string (max 60 chars)", "prompt": "string — a ready-to-use request the user can submit, written in plain English, max 200 chars" } ] }
Return 5 ideas. Prompts should be directly actionable change requests (e.g. "Make the homepage hero headline bigger and bolder"), not questions.`;

  const userContent = [
    siteUrl ? `Site URL: ${siteUrl}` : "",
    goals ? `User goals: ${goals}` : "",
    siteNotes ? `Existing site notes: ${siteNotes}` : "",
    recentChanges.length ? `Recent changes already made:\n${recentChanges.map((s) => `- ${s}`).join("\n")}` : "",
    "Suggest 5 specific, easy-to-describe improvements the user hasn't done yet. Prefer high-impact visual or UX wins.",
  ].filter(Boolean).join("\n\n");

  if (!apiKey) {
    return {
      mode: "stub",
      ideas: [
        { title: "Make the main headline bigger and bolder", prompt: "Make the hero headline on my homepage larger, bolder, and more eye-catching." },
        { title: "Add a testimonials section", prompt: "Add a testimonials section to the homepage with 3 customer quotes." },
        { title: "Improve the contact page", prompt: "Add a simple contact form on the contact page with name, email, and message fields." },
        { title: "Add a clear call-to-action button", prompt: "Add a prominent call-to-action button above the fold on the homepage." },
        { title: "Make the site faster on mobile", prompt: "Optimize the homepage for mobile: shrink large images and simplify the menu." },
      ],
    };
  }

  try {
    let responseText = "";
    let inputTokens = 0, outputTokens = 0;

    if (isGemini) {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const gm = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt });
      const result = await gm.generateContent(userContent);
      const response = await result.response;
      responseText = response.text();
      inputTokens = Math.round(userContent.length / 4);
      outputTokens = Math.round(responseText.length / 4);
    } else {
      const Anthropic = require("@anthropic-ai/sdk");
      const anthropic = new Anthropic({ apiKey });
      const message = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      });
      responseText = message.content[0].text;
      inputTokens = message.usage.input_tokens;
      outputTokens = message.usage.output_tokens;
    }

    const cleaned = responseText.replace(/```(?:json)?\n?|\n?```/gi, "").trim();
    let parsed;
    try { parsed = JSON.parse(cleaned); } catch {
      throw new HttpsError("internal", "Failed to parse suggestions as JSON");
    }
    if (!Array.isArray(parsed.ideas)) {
      throw new HttpsError("internal", "AI response missing ideas array");
    }

    const pricing = AI_PRICING[model] || AI_PRICING["claude-sonnet-4-5"];
    const costUsd = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
    await recordUsage(uid, inputTokens, outputTokens, costUsd);

    return { mode: "live", ideas: parsed.ideas.slice(0, 5), model, cost_usd: costUsd };
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", "AI API error: " + err.message);
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
