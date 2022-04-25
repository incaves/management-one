import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/styles/global.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 为请求头对象 添加Token验证的 Authorization字段(除了登陆,剩下都需要用到)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
