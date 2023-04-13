import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

// 这里需要设置 baseRoute 根据 baseroute 区分不同路由
const router = createRouter({
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ ? window.__MICRO_APP_BASE_ROUTE__ : '/'),
  routes
})

export default router
