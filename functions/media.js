const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// ─── Helper: get user profile ────────────────────────────────────────────────
async function getUserProfile(uid) {
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) throw new HttpsError("not-found", "User profile not found");
  return doc.data();
}

// ─── Helper: record token usage after a request ─────────────────────────────
async function recordUsage(uid, costUsd) {
  const ref = db.collection("users").doc(uid);
  const doc = await ref.get();
  const current = doc.exists ? (doc.data().usage_this_month || {}) : {};

  await ref.update({
    usage_this_month: {
      ...current,
      cost_usd: (current.cost_usd || 0) + costUsd,
      requests: (current.requests || 0) + 1,
    },
  });
}

// ─── generateImage: Calls Google Imagen 3 API ────────────────────────────────
exports.generateImage = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be logged in");

  const { prompt } = request.data;
  if (!prompt || typeof prompt !== "string") {
    throw new HttpsError("invalid-argument", "Missing or invalid prompt");
  }

  const uid = request.auth.uid;
  const profile = await getUserProfile(uid);

  // Determine which API key to use
  const byokKey = profile.ai_api_key || profile.claude_api_key;
  // If BYOK is a Gemini key (AIza), use it. Otherwise, fallback to Platform key.
  let apiKey = process.env.GEMINI_PLATFORM_KEY;
  if (byokKey && byokKey.startsWith("AIza")) {
    apiKey = byokKey;
  }

  if (!apiKey) {
    throw new HttpsError("failed-precondition", "No valid Gemini API key found for image generation. Upgrade to Platform Plan or provide a Gemini API key.");
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt }],
      parameters: { sampleCount: 1 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Imagen API Error:", data);
      throw new HttpsError("internal", "Image generation failed: " + (data.error?.message || response.statusText));
    }

    const prediction = data.predictions?.[0];
    if (!prediction || !prediction.bytesBase64Encoded) {
      throw new HttpsError("internal", "Unexpected response from Imagen API");
    }

    // Google Imagen 3 costs ~$0.03 per image
    const costUsd = 0.03;
    await recordUsage(uid, costUsd);

    // Save to Firestore history
    await db.collection("generated_media").add({
      userId: uid,
      prompt,
      cost_usd: costUsd,
      created_at: new Date().toISOString()
    });

    return {
      base64: prediction.bytesBase64Encoded,
      mimeType: prediction.mimeType || "image/jpeg",
      costUsd
    };
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    console.error("generateImage error:", err);
    throw new HttpsError("internal", "Failed to communicate with Image AI");
  }
});
