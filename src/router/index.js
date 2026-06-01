import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
  {
    path: '',
    component: () => import ('../views/TitlePage/TitlePage.vue')
  },
  {
    path: '/:id',
    component: () => import ('../views/NotFoundPage.vue')
  },
  {
    path: '/galeria',
    component: () => import ('../views/GaleryPage/GaleryPage.vue')
  },
  {
    path: '/gra',
    component: () => import ('../views/GamePage/GamePage.vue')
  },
  {
    path: '/produkty',
    component: () => import ('../views/ProductsPage/ProductsPage.vue')
  },
  {
    path: '/o-autorze',
    component: () => import ('../views/AboutAuthorPage/AboutAuthorPage.vue')
  },
  {
    path: '/unikalne-receptury',
    component: () => import ('../views/UniqueRecipePage/UniqueRecipePage.vue')
  },
  {
    path: '/zdjecia-kielbasy',
    component: () => import ('../views/TakePhotoPage/TakePhotoPage.vue')
  },
  {
    path: '/kalkulator',
    component: () => import ('../views/CalculatorPage/CalculatorPage.vue')
  },
  {
    path: '/wykres',
    component: () => import ('../views/ChartPage/ChartPage.vue')
  },
  {
    path: '/zlokalizuj-grilla',
    component: () => import ('../views/FindGrillPage/FindGrillPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
