import { database } from '@/main';
import { get, child, ref, update } from 'firebase/database';

export default {
  state: {
    info: {},
  },
  actions: {
    async fetchUserInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid');
        const dataSnapshot = await get(
          child(ref(database), `users/${uid}/info`)
        );
        const userInfo = dataSnapshot.val();
        commit('setInfo', userInfo);
      } catch (e) {}
    },
    async updateUserInfo({ dispatch, commit, getters }, info) {
      try {
        const uid = await dispatch('getUid');
        const data = { ...getters.info, ...info };
        await update(ref(database, `users/${uid}/info`), data);
        commit('setInfo', data);
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    },
  },
  getters: {
    info: (state) => state.info,
  },
};
