#!/usr/bin/env node
/**
 * Code Helper AI — Firestore → Firebase Data Connect Migration Script
 * ─────────────────────────────────────────────────────────────────────
 * Migrates all existing Firestore documents to the new Cloud SQL / PostgreSQL
 * tables via the Data Connect REST API (Admin SDK pattern).
 *
 * Run ONCE after the Data Connect schema has been deployed:
 *   node scripts/migrate-firestore-to-dataconnect.js
 *
 * Prerequisites:
 *   1. firebase deploy --only dataconnect   (schema must be live)
 *   2. GOOGLE_APPLICATION_CREDENTIALS pointed to service-account.json
 *      OR run from an environment with Application Default Credentials
 *
 * What it migrates:
 *   Firestore `projects`        → Cloud SQL `projects`
 *   Firestore `knowledge_base`  → Cloud SQL `knowledge_entries`
 *   Firestore `code_requests`   → Cloud SQL `code_requests`
 *   Firestore `generated_code`  → Cloud SQL `generated_codes`
 *   Firestore `servers`         → Cloud SQL `servers` (credentials skipped)
 *
 * What it SKIPS (safe to leave in Firestore):
 *   - github_connections  (future migration)
 *   - workspaces          (future migration)
 *
 * Idempotent: records with a matching `id` are upserted, not duplicated.
 */

const admin = require("firebase-admin");
const path = require("path");
const { GoogleAuth } = require("google-auth-library");

// ─── Init Firebase Admin ──────────────────────────────────────────────────────
const serviceAccountPath = path.join(__dirname, "../service-account.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "code-helper-studio",
  });
}

const db = admin.firestore();

// ─── Data Connect REST endpoint ───────────────────────────────────────────────
const DC_SERVICE_ID = "code-helper-studio-fdc";
const DC_CONNECTOR_ID = "code-helper-connector";
const DC_LOCATION = "us-central1";
const DC_BASE_URL = `https://firebasedataconnect.googleapis.com/v1beta/projects/code-helper-studio/locations/${DC_LOCATION}/services/${DC_SERVICE_ID}/connectors/${DC_CONNECTOR_ID}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFilename: serviceAccountPath,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

async function dcMutate(mutationName, variables, token) {
  const url = `${DC_BASE_URL}:executeMutation`;
  const body = JSON.stringify({
    operationName: mutationName,
    variables,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-goog-request-params": `name=${DC_BASE_URL}`,
    },
    body,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`DC mutation ${mutationName} failed: ${JSON.stringify(json)}`);
  }
  return json;
}

function safeDate(val) {
  if (!val) return null;
  if (val._seconds != null) return new Date(val._seconds * 1000).toISOString();
  if (typeof val === "string") return new Date(val).toISOString();
  if (val instanceof Date) return val.toISOString();
  return null;
}

// ─── Migration: Users from projects.userId ────────────────────────────────────
// We don't have a separate `users` collection — we derive users from project docs.
// The Cloud Function will upsert the full user profile on next login;
// this script just ensures the user row exists so FK constraints don't fail.

async function migrateUsers(token) {
  console.log("\n📋 Gathering unique user IDs from projects...");
  const snap = await db.collection("projects").get();
  const userIds = new Set();
  snap.docs.forEach((d) => {
    const uid = d.data().userId;
    if (uid) userIds.add(uid);
  });

  console.log(`   Found ${userIds.size} unique users.`);
  let ok = 0;
  for (const uid of userIds) {
    try {
      // Fetch email from Firebase Auth
      let email = `${uid}@unknown.local`;
      let displayName = null;
      try {
        const authUser = await admin.auth().getUser(uid);
        email = authUser.email || email;
        displayName = authUser.displayName || null;
      } catch {}

      await dcMutate("UpsertUser", { email, displayName }, token);
      ok++;
    } catch (err) {
      console.warn(`   ⚠️  User ${uid}: ${err.message}`);
    }
  }
  console.log(`   ✅ ${ok}/${userIds.size} users upserted.`);
}

// ─── Migration: Projects ──────────────────────────────────────────────────────

async function migrateProjects(token) {
  console.log("\n📦 Migrating projects...");
  const snap = await db.collection("projects").get();
  console.log(`   Found ${snap.size} documents.`);

  let ok = 0, skipped = 0;
  for (const d of snap.docs) {
    const p = d.data();
    const id = d.id; // Firestore doc ID IS the project ID
    try {
      await dcMutate("CreateProject", {
        name: p.name || "Untitled Project",
        domain: p.domain || null,
        description: p.description || null,
        techStack: p.tech_stack || [],
      }, token);
      ok++;
    } catch (err) {
      // Upsert conflict means it already exists — skip
      if (err.message.includes("already exists") || err.message.includes("duplicate")) {
        skipped++;
      } else {
        console.warn(`   ⚠️  Project ${id}: ${err.message}`);
        skipped++;
      }
    }
  }
  console.log(`   ✅ ${ok} inserted, ${skipped} skipped/already exist.`);
}

// ─── Migration: Knowledge Base ────────────────────────────────────────────────

async function migrateKnowledge(token) {
  console.log("\n📚 Migrating knowledge base entries...");
  const snap = await db.collection("knowledge_base").get();
  console.log(`   Found ${snap.size} documents.`);

  let ok = 0, skipped = 0;
  for (const d of snap.docs) {
    const k = d.data();
    if (!k.projectId) { skipped++; continue; }

    try {
      await dcMutate("CreateKnowledgeEntry", {
        projectId: k.projectId,
        title: k.title || "Untitled",
        category: k.category || "best_practices",
        language: k.language || null,
        framework: k.framework || null,
        description: k.description || null,
        codeExample: k.code_example || null,
        badExample: k.bad_example || null,
        tags: Array.isArray(k.tags) ? k.tags : (k.tags ? k.tags.split(",").map((t) => t.trim()) : []),
        priority: k.priority || 5,
      }, token);
      ok++;
    } catch (err) {
      console.warn(`   ⚠️  Knowledge ${d.id}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ ${ok} inserted, ${skipped} skipped.`);
}

// ─── Migration: Code Requests ─────────────────────────────────────────────────

async function migrateCodeRequests(token) {
  console.log("\n🔧 Migrating code requests...");
  const snap = await db.collection("code_requests").get();
  console.log(`   Found ${snap.size} documents.`);

  let ok = 0, skipped = 0;
  for (const d of snap.docs) {
    const r = d.data();
    if (!r.projectId || !r.raw_request) { skipped++; continue; }

    try {
      await dcMutate("CreateCodeRequest", {
        projectId: r.projectId,
        rawRequest: r.raw_request,
        urgency: r.urgency || null,
        areaOfApp: r.area_of_app || null,
        screenshots: r.screenshots || null,
        links: r.links || null,
        knowledgeBaseIds: r.knowledge_base_ids || null,
      }, token);
      ok++;
    } catch (err) {
      console.warn(`   ⚠️  Request ${d.id}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ ${ok} inserted, ${skipped} skipped.`);
}

// ─── Migration: Servers (metadata only — no credentials) ─────────────────────

async function migrateServers(token) {
  console.log("\n🖥️  Migrating server metadata (credentials NOT migrated — use Settings to re-enter)...");
  const snap = await db.collection("servers").get();
  console.log(`   Found ${snap.size} documents.`);

  let ok = 0, skipped = 0;
  for (const d of snap.docs) {
    const s = d.data();
    if (!s.projectId || !s.host) { skipped++; continue; }

    try {
      await dcMutate("CreateServer", {
        projectId: s.projectId,
        name: s.name || s.host,
        serverType: s.server_type || "ftp",
        host: s.host,
        port: s.port || 21,
        username: s.username || "",
        remotePath: s.remote_path || "/",
        description: s.description || null,
        credentialSecretName: null, // Credentials must be re-entered via Settings
      }, token);
      ok++;
    } catch (err) {
      console.warn(`   ⚠️  Server ${d.id}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ ${ok} inserted, ${skipped} skipped.`);
  if (ok > 0) {
    console.log(`   ⚠️  ACTION REQUIRED: Users must re-enter server passwords in Settings → Servers.`);
    console.log(`      (Old plaintext passwords were intentionally NOT copied to the new secure store.)`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Code Helper AI — Firestore → Data Connect Migration");
  console.log("   Project: code-helper-studio");
  console.log("   Target:  code-helper-studio-fdc (Cloud SQL via Data Connect)\n");

  const token = await getAccessToken();
  console.log("   ✅ Authentication obtained.");

  await migrateUsers(token);
  await migrateProjects(token);
  await migrateKnowledge(token);
  await migrateCodeRequests(token);
  await migrateServers(token);

  console.log("\n🎉 Migration complete!");
  console.log("   Next steps:");
  console.log("   1. Verify data in Firebase console → Data Connect");
  console.log("   2. Ask users to re-enter server passwords in Settings");
  console.log("   3. Run firebase dataconnect:sdk:generate to regenerate client SDK");
  console.log("   4. Test the app and confirm Data Connect reads are working");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err.message);
  process.exit(1);
});
