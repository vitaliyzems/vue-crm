import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import info from './info';
import category from './category';
import record from './record';
import getCurrency from '@/utils/currency';

Vue.use(Vuex);

export default new Vuex.Store({
  state: { error: null },
  getters: { error: (state) => state.error },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    async fetchCurrency() {
      const API_KEY = process.env.VUE_APP_FIXER;
      const responce = await getCurrency(API_KEY);
      const data = await responce.json();
      return data;
    },
  },
  modules: { auth, info, category, record },
});
