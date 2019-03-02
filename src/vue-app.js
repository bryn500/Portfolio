import Vue from 'vue'
import VeeValidate from 'vee-validate'

import App from './views/App'
import router from './router'
import store from './store/store.js';

Vue.use(VeeValidate);

new Vue({
  store: store,
  el: '#app',
  router,
  render: h => h(App)
})
