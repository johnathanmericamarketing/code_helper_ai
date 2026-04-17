// ─────────────────────────────────────────────
// User Profile / Settings Service
// ─────────────────────────────────────────────

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import {
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

/** Get or create the user profile document in Firestore. */
export const getUserProfile = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');

  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create default profile on first load
    const defaults = {
      uid,
      email: auth.currentUser.email,
      display_name: auth.currentUser.displayName || '',
      plan: 'free', // 'free' | 'byok' | 'platform'
      claude_api_key: null,
      claude_model: 'claude-opus-4-5',
      max_tokens: 4096,
      usage_this_month: {
        input_tokens: 0,
        output_tokens: 0,
        cost_usd: 0,
        requests: 0,
      },
      notifications: {
        email: true,
        browser: false,
      },
      safety: {
        strict_scope: true,
        require_tests: true,
        security_scan: true,
        require_approval_high_risk: true,
        lint_code: true,
        check_complexity: true,
        verify_dependencies: true,
      },
      auto_approve_low_risk: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await setDoc(ref, defaults);
    return defaults;
  }

  return snap.data();
};

/** Partial update of the user profile. */
export const updateUserProfile = async (updates) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');

  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...updates, updated_at: new Date().toISOString() });
};

/** Change the user's email (requires re-auth). */
export const changeUserEmail = async (newEmail, currentPassword) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updateEmail(user, newEmail);
  await updateUserProfile({ email: newEmail });
};

/** Change the user's password (requires re-auth). */
export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
