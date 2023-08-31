import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import layout from '../layout/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: layout,
      children: [
        {
            path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/d3demo',
      component: layout,
      children: [
        {
            path: '/d3demo',
        name: 'd3demo',
        component: () => import('../views/d3demo/d31.vue')
        }
      ]
    }   
  ]
})

export default router
