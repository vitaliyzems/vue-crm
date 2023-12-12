import { get, child, push, ref } from 'firebase/database';
import { database } from '@/main';

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      try {
        const uid = await dispatch('getUid');
        const { key } = await push(
          ref(database, `users/${uid}/records`),
          record
        );
        return key;
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async fetchRecords({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid');
        const dataSnapshot = await get(
          child(ref(database), `users/${uid}/records`)
        );
        if (dataSnapshot.exists()) {
          return Object.keys(dataSnapshot.val()).map((key) => ({
            id: key,
            ...dataSnapshot.val()[key],
          }));
        }
        return [];
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async fetchRecordById({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid');
        const dataSnapshot = await get(
          child(ref(database), `users/${uid}/records/${id}`)
        );
        if (dataSnapshot.exists()) {
          return { ...dataSnapshot.val(), id };
        }
        return null;
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
  },
};
