import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export const adminService = {
  async getUsers() {
    const fn = httpsCallable(functions, 'adminGetUsers');
    const result = await fn();
    return result.data;
  },

  async getStats() {
    const fn = httpsCallable(functions, 'adminGetStats');
    const result = await fn();
    return result.data;
  },

  async getPayments() {
    const fn = httpsCallable(functions, 'adminGetPayments');
    const result = await fn();
    return result.data;
  },

  async setUserRole(targetUid, role) {
    const fn = httpsCallable(functions, 'adminSetUserRole');
    const result = await fn({ targetUid, role });
    return result.data;
  },
};
