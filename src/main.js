import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import uploader from 'vue-simple-uploader'
import axios from 'axios'
axios.defaults.baseURL = '/api/'
axios.defaults.timeout = 6000;
Vue.prototype.$http = axios
Vue.use(uploader)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')