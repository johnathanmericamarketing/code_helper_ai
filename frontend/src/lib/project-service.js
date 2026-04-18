import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/firebase';

const PROJECTS_COL = 'projects';

function toDate(val) {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'string') return new Date(val);
  if (val instanceof Date) return val;
  return null;
}

function normalizeDates(doc) {
  const out = { ...doc };
  ['created_at', 'updated_at'].forEach((f) => {
    if (out[f]) out[f] = toDate(out[f]);
  });
  return out;
}

/** Derive a human-readable setup status from a project doc's fields. */
export function deriveSetupStatus(project) {
  if (!project) return 'incomplete';
  const hasBrand = !!project.brand?.brandName;
  const hasHosting = (project.servers?.length > 0) || !!project.domain;
  if (hasBrand && hasHosting) return 'complete';
  if (!hasBrand) return 'needs_brand';
  return 'needs_hosting';
}

export const projectService = {
  async create(data) {
    if (!auth.currentUser?.uid) throw new Error("Must be logged in to create a project.");
    const now = new Date();
    const payload = {
      userId: auth.currentUser.uid,
      name: data.name,
      domain: data.domain || '',
      tech_stack: data.tech_stack || [],
      description: data.description || '',
      // Status fields (Phase 4A)
      defaultMode: 'guided',
      setupStatus: 'needs_brand',
      brandStatus: 'incomplete',
      hostingStatus: 'disconnected',
      lastOpenedAt: null,
      activeDraftId: null,
      lastPublishedVersionId: null,
      created_at: now,
      updated_at: now,
    };
    const docRef = await addDoc(collection(db, PROJECTS_COL), payload);
    return { id: docRef.id, ...payload };
  },

  async list() {
    if (!auth.currentUser?.uid) return [];
    const snap = await getDocs(
      query(
        collection(db, PROJECTS_COL),
        where('userId', '==', auth.currentUser.uid),
        orderBy('created_at', 'desc')   // fallback; UI sorts by lastOpenedAt
      )
    );
    const projects = snap.docs.map((d) => normalizeDates({ id: d.id, ...d.data() }));
    // Sort by lastOpenedAt desc first, then created_at
    return projects.sort((a, b) => {
      const aTime = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : new Date(a.created_at).getTime();
      const bTime = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : new Date(b.created_at).getTime();
      return bTime - aTime;
    });
  },

  async get(id) {
    const snap = await getDoc(doc(db, PROJECTS_COL, id));
    if (!snap.exists()) return null;
    return normalizeDates({ id: snap.id, ...snap.data() });
  },

  async update(id, updates) {
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { ...updates, updated_at: new Date() });
  },

  async saveIntake(id, intake) {
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, {
      intake: { ...intake, completedAt: new Date() },
      updated_at: new Date(),
    });
  },

  async updateSiteNotes(id, notes) {
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { siteNotes: notes, updated_at: new Date() });
  },

  async updateBrand(id, brand) {
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, {
      brand: { ...brand, updatedAt: new Date() },
      updated_at: new Date(),
    });
  },

  async appendChangeLog(id, entry) {
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, {
      changeLog: arrayUnion({ ...entry, at: new Date() }),
      updated_at: new Date(),
    });
  },

  /** Phase 4A — record when Studio was last opened for this project */
  async touchLastOpened(id) {
    if (!id) return;
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { lastOpenedAt: new Date(), updated_at: new Date() });
  },

  /** Phase 4A — update computed status fields after brand or hosting changes */
  async refreshStatus(id) {
    if (!id) return;
    const project = await projectService.get(id);
    if (!project) return;
    const setupStatus   = deriveSetupStatus(project);
    const brandStatus   = project.brand?.brandName ? 'complete' : 'incomplete';
    const hostingStatus = project.domain ? 'connected' : 'disconnected';
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { setupStatus, brandStatus, hostingStatus, updated_at: new Date() });
  },

  /** Phase 4A — set the active draft session ID on the project */
  async setActiveDraft(id, draftId) {
    if (!id) return;
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { activeDraftId: draftId ?? null, updated_at: new Date() });
  },

  /** Phase 4A — record which version was last published */
  async setLastPublished(id, versionId) {
    if (!id) return;
    const docRef = doc(db, PROJECTS_COL, id);
    await updateDoc(docRef, { lastPublishedVersionId: versionId, updated_at: new Date() });
  },

  async delete(id) {
    const docRef = doc(db, PROJECTS_COL, id);
    await deleteDoc(docRef);
  }
};
