import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
Vue.use(VueRouter)
const routes = [{
    path: '/',
    name: 'VueUploader',
    component: () => import('../views/VueUploader.vue')
  },
  {
    path: '/diyUpload1',
    name: 'DiyUpload1',
    component: () => import('../views/DiyUpload1.vue')
  }, {
    path: '/diyUpload2',
    name: 'DiyUpload2',
    component: () => import('../views/DiyUpload2.vue')
  }, {
    path: '/sign',
    name: 'Sign',
    component: () => import('../views/Sign.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router