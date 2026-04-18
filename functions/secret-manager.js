/**
 * Secret Manager helper for Code Helper AI
 * Handles storing/retrieving FTP & SSH credentials securely.
 *
 * Pattern:
 *   - On server create: store password/key → Secret Manager, return secret resource name
 *   - Store only `credentialSecretName` in Cloud SQL (never the raw secret)
 *   - On server connect: retrieve secret by name → decrypt → use in-memory → discard
 *
 * Secret naming convention:
 *   server-cred-{serverId}
 *   Located in: projects/code-helper-studio/secrets/server-cred-{serverId}
 */

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
const PROJECT_ID = "code-helper-studio";

/**
 * Store a server credential in Secret Manager.
 * Creates the secret if it doesn't exist, then adds a new version.
 *
 * @param {string} serverId  UUID of the Server record
 * @param {object} credential  { password?, ssh_key? }
 * @returns {string} Full secret resource name for the latest version
 */
async function storeServerCredential(serverId, credential) {
  const secretId = `server-cred-${serverId}`;
  const parent = `projects/${PROJECT_ID}`;
  const secretName = `${parent}/secrets/${secretId}`;
  const payload = JSON.stringify(credential);

  // 1. Ensure the secret exists
  try {
    await client.getSecret({ name: secretName });
  } catch (err) {
    if (err.code === 5) {
      // NOT_FOUND — create it
      await client.createSecret({
        parent,
        secretId,
        secret: {
          replication: { automatic: {} },
          labels: { app: "code-helper", resource: "server-credential" },
        },
      });
    } else {
      throw err;
    }
  }

  // 2. Add a new version with the credential payload
  const [version] = await client.addSecretVersion({
    parent: secretName,
    payload: {
      data: Buffer.from(payload, "utf8"),
    },
  });

  // 3. If there are old versions, disable them to keep only the latest active
  try {
    const [versionList] = await client.listSecretVersions({
      parent: secretName,
      filter: "state:ENABLED",
    });
    for (const v of versionList) {
      if (v.name !== version.name) {
        await client.disableSecretVersion({ name: v.name });
      }
    }
  } catch {
    // Non-fatal — old versions being around is not a security issue
  }

  // Return the full resource name (stored in DB as credentialSecretName)
  return version.name;
}

/**
 * Retrieve and parse a server credential from Secret Manager.
 * Called by Cloud Functions only — never exposed to client.
 *
 * @param {string} secretName  Full resource name stored in Server.credentialSecretName
 * @returns {{ password?: string, ssh_key?: string }}
 */
async function getServerCredential(secretName) {
  if (!secretName) {
    throw new Error("No credential secret configured for this server.");
  }
  const [version] = await client.accessSecretVersion({ name: secretName });
  const raw = version.payload.data.toString("utf8");
  return JSON.parse(raw);
}

/**
 * Delete a server's credential from Secret Manager when the server is removed.
 *
 * @param {string} serverId  UUID of the Server record
 */
async function deleteServerCredential(serverId) {
  const secretName = `projects/${PROJECT_ID}/secrets/server-cred-${serverId}`;
  try {
    await client.deleteSecret({ name: secretName });
  } catch (err) {
    if (err.code !== 5) throw err; // Ignore NOT_FOUND
  }
}

module.exports = { storeServerCredential, getServerCredential, deleteServerCredential };
