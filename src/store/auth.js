import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@/main';

export default {
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const uid = await dispatch('getUid');
        await set(ref(database, `users/${uid}/info`), { bill: 10000, name });
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async logout({ commit }) {
      await signOut(auth);
      commit('clearInfo');
    },
    async getUid() {
      const user = auth.currentUser;
      return user ? user.uid : null;
    },
  },
};
