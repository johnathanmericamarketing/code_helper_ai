/**
 * Code Helper AI — Firebase Data Connect Service Layer
 *
 * This module wraps the Firebase Data Connect JS SDK (auto-generated into
 * src/lib/generated/dataconnect after `firebase dataconnect:sdk:generate`).
 *
 * IMPORTANT: This runs ALONGSIDE the existing firebase-service.js during
 * the migration period. Once all pages are migrated, firebase-service.js
 * can be deprecated. Do not delete it until migration is confirmed complete.
 *
 * Usage:
 *   import { dcProjectService } from '@/lib/dataconnect-service';
 *   const projects = await dcProjectService.list();
 */

import { getDataConnect, queryRef, mutationRef, executeQuery, executeMutation } from 'firebase/data-connect';
import { connectorConfig } from './generated/dataconnect';
import { auth } from '@/firebase';

// ─── Initialise Data Connect connector ────────────────────────────────────────
let _dc = null;
function getConnector() {
  if (!_dc) _dc = getDataConnect(connectorConfig);
  return _dc;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function requireAuth() {
  if (!auth.currentUser) throw new Error('Must be signed in.');
  return auth.currentUser;
}

// ══════════════════════════════════════════════════════════════════════════════
// USER SERVICE
// ══════════════════════════════════════════════════════════════════════════════

export const dcUserService = {
  /**
   * Upsert user profile — call this on every login to keep the record fresh.
   */
  async upsert({ email, displayName }) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpsertUser', { email, displayName });
    const { data } = await executeMutation(ref);
    return data;
  },

  /**
   * Get the current user's full profile including usage stats.
   */
  async getCurrent() {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'GetCurrentUser');
    const { data } = await executeQuery(ref);
    return data?.user ?? null;
  },

  /**
   * Update AI model preference.
   */
  async updateAiModel(model, maxTokens = 4096) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpdateAiModel', { model, maxTokens });
    await executeMutation(ref);
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// PROJECT SERVICE  (replacement for project-service.js)
// ══════════════════════════════════════════════════════════════════════════════

export const dcProjectService = {
  async list() {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListProjects');
    const { data } = await executeQuery(ref);
    return data?.projects ?? [];
  },

  async get(id) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'GetProject', { id });
    const { data } = await executeQuery(ref);
    return data?.project ?? null;
  },

  async create({ name, domain, description, techStack }) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'CreateProject', { name, domain, description, techStack });
    const { data } = await executeMutation(ref);
    return data?.project_insert;
  },

  async update(id, updates) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpdateProject', { id, ...updates });
    await executeMutation(ref);
  },

  async updateBrand(id, brand) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpdateProjectBrand', { id, brand });
    await executeMutation(ref);
  },

  async saveIntake(id, intake) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'SaveProjectIntake', { id, intake });
    await executeMutation(ref);
  },

  async softDelete(id) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'SoftDeleteProject', { id });
    await executeMutation(ref);
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE SERVICE  (replacement for knowledgeService in firebase-service.js)
// ══════════════════════════════════════════════════════════════════════════════

export const dcKnowledgeService = {
  async list(projectId) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListKnowledgeByProject', { projectId });
    const { data } = await executeQuery(ref);
    return data?.knowledgeEntries ?? [];
  },

  /**
   * Fetch only brand_identity entries — used to inject brand context into AI prompts.
   */
  async listBrandContext(projectId) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListBrandKnowledge', { projectId });
    const { data } = await executeQuery(ref);
    return data?.knowledgeEntries ?? [];
  },

  async create(projectId, entryData) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'CreateKnowledgeEntry', { projectId, ...entryData });
    const { data } = await executeMutation(ref);
    return data?.knowledgeEntry_insert;
  },

  async update(id, entryData) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpdateKnowledgeEntry', { id, ...entryData });
    await executeMutation(ref);
  },

  async delete(id) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'DeleteKnowledgeEntry', { id });
    await executeMutation(ref);
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// CODE REQUEST SERVICE
// ══════════════════════════════════════════════════════════════════════════════

export const dcRequestsService = {
  async list(projectId) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListCodeRequestsByProject', { projectId });
    const { data } = await executeQuery(ref);
    return data?.codeRequests ?? [];
  },

  async getWithCode(id) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'GetCodeRequestWithCode', { id });
    const { data } = await executeQuery(ref);
    return data?.codeRequest ?? null;
  },

  async create(projectId, requestData) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'CreateCodeRequest', { projectId, ...requestData });
    const { data } = await executeMutation(ref);
    return data?.codeRequest_insert;
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// SERVERS SERVICE
// ══════════════════════════════════════════════════════════════════════════════

export const dcServersService = {
  async list(projectId) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListServersByProject', { projectId });
    const { data } = await executeQuery(ref);
    // credentialSecretName is intentionally excluded from the query — safe to return as-is
    return data?.servers ?? [];
  },

  /**
   * Create a server via Cloud Function (which handles credential storage in Secret Manager).
   * The CF returns the credentialSecretName, which we then store in the DB.
   */
  async create(projectId, serverData) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'CreateServer', { projectId, ...serverData });
    const { data } = await executeMutation(ref);
    return data?.server_insert;
  },

  async update(id, serverData) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'UpdateServer', { id, ...serverData });
    await executeMutation(ref);
  },

  async delete(id) {
    requireAuth();
    const dc = getConnector();
    const ref = mutationRef(dc, 'DeleteServer', { id });
    await executeMutation(ref);
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// DEPLOY LOG SERVICE  (new — replaces no equivalent in firebase-service.js)
// ══════════════════════════════════════════════════════════════════════════════

export const dcDeployLogService = {
  async listByProject(projectId, limit = 20) {
    requireAuth();
    const dc = getConnector();
    const ref = queryRef(dc, 'ListDeployLogsByProject', { projectId, limit });
    const { data } = await executeQuery(ref);
    return data?.deployLogs ?? [];
  },
};
