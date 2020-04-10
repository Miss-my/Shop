import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/css/common.css'
import './assets/Iconfont/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
axios.interceptors.request.use((config)=>{
  console.log(config);

  config.headers.Authorization= window.sessionStorage.getItem('token');

  //必须返回config
  return config;
})

Vue.prototype.$http=axios




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
