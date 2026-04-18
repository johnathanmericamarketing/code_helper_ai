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
      created_at: now,
      updated_at: now,
    };
    
    const docRef = await addDoc(collection(db, PROJECTS_COL), payload);
    return { id: docRef.id, ...payload };
  },

  async list() {
    if (!auth.currentUser?.uid) return [];
    const snap = await getDocs(
      query(collection(db, PROJECTS_COL), where('userId', '==', auth.currentUser.uid), orderBy('created_at', 'desc'))
    );
    return snap.docs.map((d) => normalizeDates({ id: d.id, ...d.data() }));
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

  async delete(id) {
    const docRef = doc(db, PROJECTS_COL, id);
    await deleteDoc(docRef);
  }
};
