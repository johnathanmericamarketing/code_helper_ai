const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const db = getFirestore();

// ─── Helper: verify caller is super_admin ───────────────────────────────────
async function requireSuperAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in");
  }
  const userDoc = await db.collection("users").doc(request.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "super_admin") {
    throw new HttpsError("permission-denied", "Super admin access required");
  }
}

// ─── adminGetUsers: return all user profiles ────────────────────────────────
exports.adminGetUsers = onCall(async (request) => {
  await requireSuperAdmin(request);

  const snap = await db.collection("users").get();
  return snap.docs.map((d) => {
    const data = d.data();
    // Mask sensitive fields
    return {
      uid: data.uid,
      email: data.email,
      display_name: data.display_name || "",
      plan: data.plan || "free",
      role: data.role || "user",
      has_api_key: !!data.claude_api_key,
      claude_model: data.claude_model || "claude-sonnet-4-5",
      usage_this_month: data.usage_this_month || {},
      stripe_customer_id: data.stripe_customer_id || null,
      stripe_subscription_id: data.stripe_subscription_id || null,
      created_at: data.created_at || null,
    };
  });
});

// ─── adminGetStats: aggregate platform stats ────────────────────────────────
exports.adminGetStats = onCall(async (request) => {
  await requireSuperAdmin(request);

  const usersSnap = await db.collection("users").get();
  const users = usersSnap.docs.map((d) => d.data());

  const totalUsers = users.length;
  const byokUsers = users.filter((u) => u.plan === "byok").length;
  const platformUsers = users.filter((u) => u.plan === "platform").length;
  const freeUsers = users.filter((u) => u.plan === "free").length;

  const totalInputTokens = users.reduce(
    (sum, u) => sum + (u.usage_this_month?.input_tokens || 0), 0
  );
  const totalOutputTokens = users.reduce(
    (sum, u) => sum + (u.usage_this_month?.output_tokens || 0), 0
  );
  const totalCost = users.reduce(
    (sum, u) => sum + (u.usage_this_month?.cost_usd || 0), 0
  );
  const totalRequests = users.reduce(
    (sum, u) => sum + (u.usage_this_month?.requests || 0), 0
  );

  return {
    users: { total: totalUsers, free: freeUsers, byok: byokUsers, platform: platformUsers },
    usage: {
      total_input_tokens: totalInputTokens,
      total_output_tokens: totalOutputTokens,
      total_cost_usd: totalCost,
      total_requests: totalRequests,
    },
  };
});

// ─── adminSetUserRole: promote / demote a user ──────────────────────────────
exports.adminSetUserRole = onCall(async (request) => {
  await requireSuperAdmin(request);

  const { targetUid, role } = request.data;
  if (!targetUid || !role) {
    throw new HttpsError("invalid-argument", "Missing targetUid or role");
  }
  const allowedRoles = ["user", "super_admin"];
  if (!allowedRoles.includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid role");
  }

  await db.collection("users").doc(targetUid).update({ role });
  return { success: true, message: `User ${targetUid} updated to role: ${role}` };
});

// ─── adminGetPayments: stub — returns mock data until Stripe key is wired ───
exports.adminGetPayments = onCall(async (request) => {
  await requireSuperAdmin(request);

  // TODO: Replace with real Stripe API call when STRIPE_SECRET_KEY is configured.
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const charges = await stripe.charges.list({ limit: 100 });
  return {
    payments: [],
    note: "Connect your Stripe Secret Key in Firebase Functions config to see real payment data.",
  };
});
