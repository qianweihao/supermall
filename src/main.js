import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import toast from './components/common/toast/index.js'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.use(toast)

FastClick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/cat.png')
})
new Vue({

  router,
  store,
  mode: 'history',
  render: h => h(App)
}).$mount('#app')
