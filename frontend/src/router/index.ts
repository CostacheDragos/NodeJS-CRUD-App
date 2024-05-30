import { createRouter, createWebHistory } from 'vue-router'
import BookTable from '@/components/BookTable.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BookTable
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../components/BookEdit.vue')
    }
  ]
})

export default router
