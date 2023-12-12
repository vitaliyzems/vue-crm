import { ref, push, get, child, update } from 'firebase/database';
import { database } from '@/main';

export default {
  actions: {
    async createCategory({ dispatch, commit }, { title, limit }) {
      try {
        const uid = await dispatch('getUid');
        const category = await push(ref(database, `users/${uid}/categories`), {
          title,
          limit,
        });
        return { id: category.key, title, limit };
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async fetchCategories({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid');
        const dataSnapshot = await get(
          child(ref(database), `users/${uid}/categories`)
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
    async fetchCategoryById({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid');
        const dataSnapshot = await get(
          child(ref(database), `users/${uid}/categories/${id}`)
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
    async editCategory({ dispatch, commit }, { id, title, limit }) {
      try {
        const uid = await dispatch('getUid');
        await update(child(ref(database, `users/${uid}/categories`), id), {
          title,
          limit,
        });
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
  },
};
