import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {jwtDecode} from "jwt-decode";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.config.productionTip = false

if (localStorage.getItem('jwt')) {
  const decoded = jwtDecode(localStorage.getItem('jwt'));
  store.commit('setLoggedIn', true);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
