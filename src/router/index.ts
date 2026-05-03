import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: () => import ('../views/TitlePage.vue')
  },
  {
    path: '/:id',
    component: () => import ('../views/NotFoundPage.vue')
  },
  {
    path: '/galeria',
    component: () => import ('../views/GaleryPage.vue')
  },
  {
    path: '/gra',
    component: () => import ('../views/GamePage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
