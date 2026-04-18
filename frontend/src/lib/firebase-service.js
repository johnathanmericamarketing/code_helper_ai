import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, auth } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Convert Firestore Timestamp / ISO string → JS Date */
function toDate(val) {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'string') return new Date(val);
  if (val instanceof Date) return val;
  return null;
}

/** Normalise timestamps on a raw Firestore doc. */
function normalizeDates(doc, fields = ['created_at', 'updated_at']) {
  const out = { ...doc };
  fields.forEach((f) => {
    if (out[f]) out[f] = toDate(out[f]);
  });
  return out;
}

// ─────────────────────────────────────────────
// Code Requests
// ─────────────────────────────────────────────

const REQUESTS_COL = 'code_requests';

export const requestsService = {
  async create(data, projectId = null) {
    const id = uuidv4();
    const now = new Date();
    const doc = {
      id,
      userId: auth.currentUser?.uid,
      projectId: projectId || localStorage.getItem('codehelper_active_project') || null,
      raw_request: data.raw_request,
      urgency: data.urgency || null,
      area_of_app: data.area_of_app || null,
      screenshots: data.screenshots || null,
      links: data.links || null,
      knowledge_base_ids: data.knowledge_base_ids || null,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };
    await addDoc(collection(db, REQUESTS_COL), doc);
    return doc;
  },

  async list(projectId = null) {
    let q = query(collection(db, REQUESTS_COL), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'));
    const activeProject = projectId || localStorage.getItem('codehelper_active_project');
    if (activeProject) {
      q = query(collection(db, REQUESTS_COL), where('userId', '==', auth.currentUser?.uid), where('projectId', '==', activeProject), orderBy('created_at', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeDates(d.data()));
  },

  async get(id) {
    const snap = await getDocs(
      query(collection(db, REQUESTS_COL), where('id', '==', id))
    );
    if (snap.empty) return null;
    return normalizeDates(snap.docs[0].data());
  },

  async updateStatus(id, status) {
    const snap = await getDocs(
      query(collection(db, REQUESTS_COL), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Request not found');
    await updateDoc(snap.docs[0].ref, { status, updated_at: new Date() });
  },

  /** Call the processCodeRequest Cloud Function to generate AI code */
  async process(id, rawRequest, context = '', overrideModel = null) {
    // You could also update the status to "processing" here if desired
    await requestsService.updateStatus(id, 'generating');

    // Call the Cloud Function
    const fn = httpsCallable(functions, 'processCodeRequest');
    const result = await fn({ requestId: id, rawRequest, context, overrideModel });

    // Return the payload from the Cloud Function
    return result.data;
  },

  /** Call suggestIdeas to get 5 plain-English change suggestions */
  async suggestIdeas({ siteUrl = '', goals = '', siteNotes = '', recentChanges = [] } = {}) {
    const fn = httpsCallable(functions, 'suggestIdeas');
    const result = await fn({ siteUrl, goals, siteNotes, recentChanges });
    return result.data;
  },
};

// ─────────────────────────────────────────────
// Generated Code
// ─────────────────────────────────────────────

export const generatedCodeService = {
  async getByRequest(requestId) {
    const snap = await getDocs(
      query(collection(db, 'generated_code'), where('request_id', '==', requestId))
    );
    return snap.docs.map((d) => normalizeDates(d.data(), ['created_at']));
  },
};

// ─────────────────────────────────────────────
// Knowledge Base
// ─────────────────────────────────────────────

export const knowledgeService = {
  async list(projectId = null) {
    let q = query(collection(db, 'knowledge_base'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'));
    const activeProject = projectId || localStorage.getItem('codehelper_active_project');
    if (activeProject) {
      q = query(collection(db, 'knowledge_base'), where('userId', '==', auth.currentUser?.uid), where('projectId', '==', activeProject), orderBy('created_at', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeDates(d.data()));
  },

  async create(data, projectId = null) {
    const id = uuidv4();
    const now = new Date();
    const activeProject = projectId || localStorage.getItem('codehelper_active_project') || null;
    const doc = { id, userId: auth.currentUser?.uid, projectId: activeProject, ...data, created_at: now, updated_at: now };
    await addDoc(collection(db, 'knowledge_base'), doc);
    return doc;
  },

  async update(id, data) {
    const snap = await getDocs(
      query(collection(db, 'knowledge_base'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Knowledge not found');
    await updateDoc(snap.docs[0].ref, { ...data, updated_at: new Date() });
  },

  async delete(id) {
    const snap = await getDocs(
      query(collection(db, 'knowledge_base'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Knowledge not found');
    await deleteDoc(snap.docs[0].ref);
  },
};

// ─────────────────────────────────────────────
// Servers (SSH / SFTP / FTP)
// Sensitive creds stored as-is (Firestore is private; add Firebase Auth for full security)
// ─────────────────────────────────────────────

export const serversService = {
  async list(projectId = null) {
    let q = query(collection(db, 'servers'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'));
    const activeProject = projectId || localStorage.getItem('codehelper_active_project');
    if (activeProject) {
      q = query(collection(db, 'servers'), where('userId', '==', auth.currentUser?.uid), where('projectId', '==', activeProject), orderBy('created_at', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const srv = normalizeDates(d.data());
      // Mask sensitive fields on read
      if (srv.password) srv.password = '***';
      if (srv.ssh_key) srv.ssh_key = '***';
      return srv;
    });
  },

  async create(data, projectId = null) {
    const id = uuidv4();
    const now = new Date();
    const activeProject = projectId || localStorage.getItem('codehelper_active_project') || null;
    const doc = {
      id,
      userId: auth.currentUser?.uid,
      projectId: activeProject,
      name: data.name,
      server_type: data.server_type,
      host: data.host,
      port: parseInt(data.port),
      username: data.username,
      password: data.password || null,
      ssh_key: data.ssh_key || null,
      remote_path: data.remote_path || '/',
      description: data.description || null,
      is_active: true,
      last_connected: null,
      created_at: now,
      updated_at: now,
    };
    await addDoc(collection(db, 'servers'), doc);
    return { ...doc, password: doc.password ? '***' : null, ssh_key: doc.ssh_key ? '***' : null };
  },

  async update(id, data) {
    const snap = await getDocs(
      query(collection(db, 'servers'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Server not found');
    const updates = { ...data, updated_at: new Date() };
    if (data.port) updates.port = parseInt(data.port);
    // Only update password/ssh_key if new value provided
    if (!data.password) delete updates.password;
    if (!data.ssh_key) delete updates.ssh_key;
    await updateDoc(snap.docs[0].ref, updates);
  },

  async delete(id) {
    const snap = await getDocs(
      query(collection(db, 'servers'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Server not found');
    await deleteDoc(snap.docs[0].ref);
  },

  async testConnection(serverId) {
    const testFn = httpsCallable(functions, 'testConnection');
    const result = await testFn({ serverId });
    return result.data;
  },

  async listRemoteFiles(serverId, path = '') {
    const fn = httpsCallable(functions, 'listRemoteFiles');
    const result = await fn({ serverId, path });
    return result.data;
  },

  async readRemoteFile(serverId, filePath) {
    const fn = httpsCallable(functions, 'readRemoteFile');
    const result = await fn({ serverId, filePath });
    return result.data;
  },

  async deployCode(serverId, fileData) {
    const fn = httpsCallable(functions, 'deployCode');
    const result = await fn({ serverId, fileData });
    return result.data;
  },
};

// ─────────────────────────────────────────────
// GitHub Connections
// ─────────────────────────────────────────────

export const githubService = {
  async list() {
    const snap = await getDocs(
      query(collection(db, 'github_connections'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'))
    );
    return snap.docs.map((d) => {
      const conn = normalizeDates(d.data());
      if (conn.access_token) conn.access_token = '***STORED***';
      return conn;
    });
  },

  async create(data) {
    const id = uuidv4();
    const now = new Date();
    const doc = {
      id,
      userId: auth.currentUser?.uid,
      name: data.name,
      access_token: data.access_token,
      username: data.username || null,
      default_repo: data.default_repo || null,
      default_branch: data.default_branch || 'main',
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    await addDoc(collection(db, 'github_connections'), doc);
    return { ...doc, access_token: '***STORED***' };
  },

  async delete(id) {
    const snap = await getDocs(
      query(collection(db, 'github_connections'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Connection not found');
    await deleteDoc(snap.docs[0].ref);
  },
};

// ─────────────────────────────────────────────
// Local Workspaces
// ─────────────────────────────────────────────

export const workspacesService = {
  async list() {
    const snap = await getDocs(
      query(collection(db, 'workspaces'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'))
    );
    return snap.docs.map((d) => normalizeDates(d.data(), ['created_at']));
  },

  async create(data) {
    const id = uuidv4();
    const now = new Date();
    const doc = {
      id,
      userId: auth.currentUser?.uid,
      name: data.name,
      path: data.path,
      description: data.description || null,
      is_git_repo: false,
      created_at: now,
    };
    await addDoc(collection(db, 'workspaces'), doc);
    return doc;
  },

  async delete(id) {
    const snap = await getDocs(
      query(collection(db, 'workspaces'), where('id', '==', id))
    );
    if (snap.empty) throw new Error('Workspace not found');
    await deleteDoc(snap.docs[0].ref);
  },
};

// ─────────────────────────────────────────────
// Draft Sessions  (Phase 4B)
// One active draft per project. Auto-saved after every generation.
// Cleared or archived when a version is published.
// ─────────────────────────────────────────────

const DRAFTS_COL = 'draft_sessions';

export const draftSessionsService = {
  /**
   * Upsert the active draft for a project.
   * Uses a deterministic doc ID: "draft_{projectId}" so there is exactly one.
   */
  async save(projectId, draftData) {
    if (!projectId) return null;
    const draftId = `draft_${projectId}`;
    const docRef  = doc(db, DRAFTS_COL, draftId);
    const payload = {
      id:           draftId,
      projectId,
      userId:       auth.currentUser?.uid,
      previewHtml:  draftData.previewHtml  ?? null,
      latestPrompt: draftData.latestPrompt ?? null,
      reviewSummary: draftData.reviewSummary ?? null,
      scope:        draftData.scope        ?? null,
      goal:         draftData.goal         ?? null,
      constraints:  draftData.constraints  ?? null,
      brandSuggestion: draftData.brandSuggestion ?? null,
      updatedAt:    new Date(),
    };
    // setDoc with merge so we never lose partial fields on partial saves
    const { setDoc } = await import('firebase/firestore');
    await setDoc(docRef, payload, { merge: true });
    return draftId;
  },

  /** Read the current draft for a project (null if none exists) */
  async get(projectId) {
    if (!projectId) return null;
    const draftId = `draft_${projectId}`;
    const snap    = await getDoc(doc(db, DRAFTS_COL, draftId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  /** Clear the draft (called after publish or explicit discard) */
  async clear(projectId) {
    if (!projectId) return;
    const draftId = `draft_${projectId}`;
    try { await deleteDoc(doc(db, DRAFTS_COL, draftId)); }
    catch { /* already gone — no-op */ }
  },
};

// ─────────────────────────────────────────────
// Versions  (Phase 4C)
// Immutable snapshots written on publish, save-draft, and restore.
// Stored as a top-level collection (not sub-collection) so the
// Versions page can query across projects with a single index.
// ─────────────────────────────────────────────

const VERSIONS_COL = 'versions';

export const versionsService = {
  /**
   * Write a new version snapshot.
   * Called by the Studio on publish, save-draft, and restore.
   */
  async create(projectId, versionData) {
    if (!projectId) throw new Error('projectId is required');
    const { v4: uuidv4 } = await import('uuid');
    const id  = uuidv4();
    const now = new Date();
    const payload = {
      id,
      projectId,
      userId:                auth.currentUser?.uid,
      // 'draft' | 'published' | 'restored'
      type:                  versionData.type           ?? 'draft',
      name:                  versionData.name           ?? null,
      summary:               versionData.summary        ?? null,
      prompt:                versionData.prompt         ?? null,
      model:                 versionData.model          ?? null,
      previewHtml:           versionData.previewHtml    ?? null,
      restoreSourceVersionId: versionData.restoreSourceVersionId ?? null,
      createdAt: now,
    };
    await addDoc(collection(db, VERSIONS_COL), payload);
    return payload;
  },

  /** List all versions for a project, newest first */
  async list(projectId) {
    if (!projectId) return [];
    const snap = await getDocs(
      query(
        collection(db, VERSIONS_COL),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      )
    );
    return snap.docs.map((d) => {
      const v = { id: d.id, ...d.data() };
      if (v.createdAt?.toDate) v.createdAt = v.createdAt.toDate();
      return v;
    });
  },

  /** Get a single version by its document ID */
  async getById(versionDocId) {
    const snap = await getDocs(
      query(collection(db, VERSIONS_COL), where('id', '==', versionDocId))
    );
    if (snap.empty) return null;
    const v = { id: snap.docs[0].id, ...snap.docs[0].data() };
    if (v.createdAt?.toDate) v.createdAt = v.createdAt.toDate();
    return v;
  },
};

