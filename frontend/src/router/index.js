// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/api',
    component: () => import('@/layouts/default/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'users',
        name: 'Usuarios',
        component: () => import('@/views/UserView.vue'),
      },
      {
        path: 'deudas',
        name: 'Deudas',
        component: () => import('@/views/Deudas.vue'),
      },
      {
        path: 'apelacion',
        name: 'Apelaciones',
        component: () => import('@/views/Apelaciones.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && (!loggedIn || loggedIn === 'undefined')) {
    return next('/login');
  }

  next();
})

export default router