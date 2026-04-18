/**
 * realtime-service.js
 *
 * Firebase Realtime Database service layer.
 *
 * Architecture:
 *   Firestore  — permanent records (requests, generated code, deploy logs)
 *   RTDB       — ephemeral LIVE state (generation progress, deploy progress, presence)
 *
 * Data shape in RTDB:
 *
 *   /generation/{requestId}/
 *     status:   "idle" | "queued" | "analyzing" | "generating" | "validating" | "done" | "error"
 *     step:     string (human-readable current step label)
 *     progress: 0-100
 *     error:    string | null
 *     startedAt: ISO string
 *     updatedAt: ISO string
 *
 *   /deployment/{deployJobId}/
 *     status:    "idle" | "connecting" | "uploading" | "done" | "error"
 *     totalFiles: number
 *     doneFiles:  number
 *     currentFile: string
 *     error:      string | null
 *     startedAt:  ISO string
 *     updatedAt:  ISO string
 *     log:        { [pushId]: { file, status, bytes, at } }
 *
 *   /presence/{uid}/
 *     online:   true | false
 *     lastSeen: ISO string
 *     project:  string (active project id)
 */

import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  push,
  serverTimestamp,
  onDisconnect,
  remove,
} from 'firebase/database';
import { rtdb, auth } from '@/firebase';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Generation Progress
//
// Written by: Cloud Function (processCodeRequest)
// Read by:    WorkspaceStudioPage → useGenerationProgress hook
// ─────────────────────────────────────────────────────────────────────────────

export const generationRTDB = {
  /** Returns the RTDB ref for a given requestId's progress node. */
  ref(requestId) {
    return ref(rtdb, `generation/${requestId}`);
  },

  /** Initialise a progress node at the start of a generation run (client-side). */
  async init(requestId) {
    await set(this.ref(requestId), {
      status:    'queued',
      step:      'Request queued…',
      progress:  0,
      error:     null,
      startedAt: now(),
      updatedAt: now(),
    });
  },

  /**
   * Subscribe to live updates for a requestId.
   * @param {string}   requestId
   * @param {function} callback  — called with the snapshot value on every change
   * @returns {function}         — unsubscribe function
   */
  subscribe(requestId, callback) {
    const r = this.ref(requestId);
    onValue(r, (snap) => callback(snap.val()));
    return () => off(r);
  },

  /** Clean up the progress node after the UI has consumed the result. */
  async clear(requestId) {
    await remove(this.ref(requestId));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Deployment Progress
//
// Written by: Cloud Function (deployCode) as files are uploaded
// Read by:    DeploymentDialog → useDeployProgress hook
// ─────────────────────────────────────────────────────────────────────────────

export const deploymentRTDB = {
  ref(jobId) {
    return ref(rtdb, `deployment/${jobId}`);
  },

  logRef(jobId) {
    return ref(rtdb, `deployment/${jobId}/log`);
  },

  /** Create a fresh deployment job node. */
  async init(jobId, totalFiles = 0) {
    await set(this.ref(jobId), {
      status:      'connecting',
      totalFiles,
      doneFiles:   0,
      currentFile: '',
      error:       null,
      startedAt:   now(),
      updatedAt:   now(),
    });
  },

  subscribe(jobId, callback) {
    const r = this.ref(jobId);
    onValue(r, (snap) => callback(snap.val()));
    return () => off(r);
  },

  async clear(jobId) {
    await remove(this.ref(jobId));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// User Presence
//
// Sets /presence/{uid} to online=true when authenticated,
// and uses onDisconnect() to flip online=false automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const presenceRTDB = {
  /** Call once after sign-in to start presence tracking. */
  async start(uid, activeProjectId = null) {
    const presRef = ref(rtdb, `presence/${uid}`);

    const payload = {
      online:   true,
      lastSeen: now(),
      project:  activeProjectId || null,
    };

    // Set current state
    await set(presRef, payload);

    // Register disconnect handler — Firebase runs this server-side when
    // the connection drops, ensuring presence is always accurate.
    await onDisconnect(presRef).update({
      online:   false,
      lastSeen: serverTimestamp(),
    });
  },

  /** Update the active project visible in presence. */
  async updateProject(uid, projectId) {
    if (!uid) return;
    await update(ref(rtdb, `presence/${uid}`), {
      project:  projectId,
      lastSeen: now(),
    });
  },

  /** Call on sign-out. */
  async stop(uid) {
    if (!uid) return;
    await update(ref(rtdb, `presence/${uid}`), {
      online:   false,
      lastSeen: now(),
    });
  },

  /** Read another user's presence (for future collaboration). */
  subscribe(uid, callback) {
    const r = ref(rtdb, `presence/${uid}`);
    onValue(r, (snap) => callback(snap.val()));
    return () => off(r);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// useGenerationProgress React Hook
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

/**
 * Subscribes to live generation progress for a given requestId.
 *
 * @param {string|null} requestId
 * @returns {{ status, step, progress, error }}
 *
 * Usage:
 *   const { status, step, progress } = useGenerationProgress(activeRequestId);
 */
export function useGenerationProgress(requestId) {
  const [state, setState] = useState({
    status:   'idle',
    step:     '',
    progress: 0,
    error:    null,
  });
  const unsubRef = useRef(null);

  useEffect(() => {
    // Cleanup previous subscription
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!requestId) {
      setState({ status: 'idle', step: '', progress: 0, error: null });
      return;
    }

    unsubRef.current = generationRTDB.subscribe(requestId, (val) => {
      if (val) setState(val);
      else     setState({ status: 'idle', step: '', progress: 0, error: null });
    });

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [requestId]);

  return state;
}

/**
 * Subscribes to live deployment progress for a given jobId.
 *
 * @param {string|null} jobId
 * @returns {{ status, totalFiles, doneFiles, currentFile, error, log }}
 */
export function useDeployProgress(jobId) {
  const [state, setState] = useState({
    status:      'idle',
    totalFiles:  0,
    doneFiles:   0,
    currentFile: '',
    error:       null,
    log:         {},
  });
  const unsubRef = useRef(null);

  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!jobId) {
      setState({ status: 'idle', totalFiles: 0, doneFiles: 0, currentFile: '', error: null, log: {} });
      return;
    }

    unsubRef.current = deploymentRTDB.subscribe(jobId, (val) => {
      if (val) setState({ log: {}, ...val });
    });

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [jobId]);

  return state;
}
