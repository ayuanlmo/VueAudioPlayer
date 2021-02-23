import Vue from 'vue'
import App from './App.vue'
import router from './router';



Vue.config.productionTip = false
console.log('\n' + ' %c VueAudioPlayer'  + ' ' + ' %c https://github.com/ayuanlmo/VueAudioPlayer ' + '\n', 'color: #ffffff;font-weight: 700; background: #3697fc; padding:5px 0;','background: #93d7ff; padding:5px 0;');

window.AppVue = new Vue({
  render: h => h(App),
  router
}).$mount('#app')
