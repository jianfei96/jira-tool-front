import { createRouter, createWebHistory } from 'vue-router'
import AddSubTicket from '../views/AddSubTicket.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AddSubTicket
    },
    {
      path: '/test-connection',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TestConnetion.vue')
    }
  ]
})

export default router
