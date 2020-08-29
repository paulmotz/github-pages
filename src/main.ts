import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChessPawn, faChessKnight, faChessBishop, faChessRook, faChessQueen, faChessKing } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChessPawn);
library.add(faChessKnight);
library.add(faChessBishop);
library.add(faChessRook);
library.add(faChessQueen);
library.add(faChessKing);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  router,
  render : h => h(App),
}).$mount('#app');
