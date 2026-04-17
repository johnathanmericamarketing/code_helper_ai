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

/** Generate a simulated workflow payload for a request. */
function buildGeneratedPayload(requestId, rawRequest) {
  return {
    id: uuidv4(),
    request_id: requestId,
    structured_task: {
      task_type: 'feature',
      title: 'Implement requested feature',
      context: rawRequest,
      current_behavior: null,
      expected_behavior: 'Feature should work as described in the request',
      acceptance_criteria: [
        'Code compiles without errors',
        'Feature functions as expected',
        'Tests pass successfully',
      ],
      technical_notes: [
        'Follow existing code patterns',
        'Maintain backward compatibility',
      ],
      assumptions: ['Current codebase is stable', 'Dependencies are up to date'],
    },
    execution_plan: {
      files_to_modify: ['src/components/Feature.jsx', 'src/utils/helpers.js'],
      files_to_avoid: ['src/core/config.js', 'src/auth/*'],
      risk_level: 'low',
      change_scope_summary: 'Isolated changes to feature components only',
    },
    code_changes: [
      {
        file_path: 'src/components/Feature.jsx',
        diff:
          "import React, { useState } from 'react';\n\nconst Feature = () => {\n  const [data, setData] = useState(null);\n  \n  const handleAction = () => {\n    console.log('Feature activated');\n  };\n  \n  return (\n    <div className=\"feature-container\">\n      <button onClick={handleAction}>\n        Activate Feature\n      </button>\n    </div>\n  );\n};\n\nexport default Feature;",
        description: 'Added new feature component with action handler',
      },
      {
        file_path: 'src/utils/helpers.js',
        diff:
          "export const validateInput = (input) => {\n  return input && input.length > 0;\n};\n\nexport const formatOutput = (data) => {\n  return JSON.stringify(data, null, 2);\n};",
        description: 'Added utility functions for input validation and output formatting',
      },
    ],
    validation_checks: [
      {
        check_name: 'Scope Validation',
        result: 'passed',
        message: 'All changes are within allowed files',
        details: 'No modifications detected outside the planned scope',
      },
      {
        check_name: 'Syntax Check',
        result: 'passed',
        message: 'All code is syntactically correct',
        details: null,
      },
      {
        check_name: 'Dependency Check',
        result: 'passed',
        message: 'No new dependencies required',
        details: null,
      },
      {
        check_name: 'Breaking Changes',
        result: 'passed',
        message: 'No breaking changes detected',
        details: null,
      },
      {
        check_name: 'Test Coverage',
        result: 'warning',
        message: 'Consider adding unit tests',
        details: 'New feature code does not have associated tests',
      },
    ],
    summary:
      'Successfully generated code for the requested feature. All validation checks passed with one warning.',
    rollback_instructions: 'Run `git checkout HEAD~1` to revert changes if needed.',
    created_at: new Date(),
  };
}

// ─────────────────────────────────────────────
// Code Requests
// ─────────────────────────────────────────────

const REQUESTS_COL = 'code_requests';
const STATUSES = ['structured', 'planned', 'generated', 'validated'];

export const requestsService = {
  async create(data) {
    const id = uuidv4();
    const now = new Date();
    const doc = {
      id,
      userId: auth.currentUser?.uid,
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

  async list() {
    const snap = await getDocs(
      query(collection(db, REQUESTS_COL), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'))
    );
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

  /** Simulate AI processing through all workflow stages, then save generated code. */
  async process(id, rawRequest) {
    for (const stage of STATUSES) {
      await requestsService.updateStatus(id, stage);
    }
    // Check if generated code already exists
    const existing = await generatedCodeService.getByRequest(id);
    if (existing.length > 0) return existing[0];

    const payload = buildGeneratedPayload(id, rawRequest);
    await addDoc(collection(db, 'generated_code'), payload);
    return payload;
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
  async list() {
    const snap = await getDocs(
      query(collection(db, 'knowledge_base'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'))
    );
    return snap.docs.map((d) => normalizeDates(d.data()));
  },

  async create(data) {
    const id = uuidv4();
    const now = new Date();
    const doc = { id, userId: auth.currentUser?.uid, ...data, created_at: now, updated_at: now };
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
  async list() {
    const snap = await getDocs(
      query(collection(db, 'servers'), where('userId', '==', auth.currentUser?.uid), orderBy('created_at', 'desc'))
    );
    return snap.docs.map((d) => {
      const srv = normalizeDates(d.data());
      // Mask sensitive fields on read
      if (srv.password) srv.password = '***';
      if (srv.ssh_key) srv.ssh_key = '***';
      return srv;
    });
  },

  async create(data) {
    const id = uuidv4();
    const now = new Date();
    const doc = {
      id,
      userId: auth.currentUser?.uid,
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
