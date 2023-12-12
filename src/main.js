import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import App from './App.vue';
import router from './router';
import store from './store';
import Loader from './components/app/Loader';
import dateFilter from './filters/date.filter';
import currencyFilter from './filters/currency.filter';
import localizeFilter from './filters/localize.filter';
import messagePlugin from './utils/message.plugin';
import tooltipDirective from './directives/tooltip.directive';
import './registerServiceWorker';
import 'materialize-css/dist/js/materialize.min';
import 'firebase/auth';
import 'firebase/compat/database';

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter);
Vue.filter('currencyFilter', currencyFilter);
Vue.filter('localizeFilter', localizeFilter);
Vue.directive('tooltip', tooltipDirective);
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

export const app = initializeApp({
  apiKey: 'AIzaSyC5mtXbBAL_JQTYxD6u2-eeFnj0eR8J0KU',
  authDomain: 'vue-crm-vito.firebaseapp.com',
  databaseURL:
    'https://vue-crm-vito-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vue-crm-vito',
  storageBucket: 'vue-crm-vito.appspot.com',
  messagingSenderId: '74365709705',
  appId: '1:74365709705:web:0cb6d1ce64c9941c340558',
});

export const auth = getAuth(app);

export const database = getDatabase(app);

let vueApp;

onAuthStateChanged(auth, () => {
  if (!vueApp) {
    vueApp = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
