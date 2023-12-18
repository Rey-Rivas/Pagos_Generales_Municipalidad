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
        path: 'creardeuda',
        name: 'Crear Deuda',
        component: () => import('@/views/CrearDeudaView.vue'),
      },
      {
        path: 'beneficios',
        name: 'Beneficios',
        component: () => import('@/views/Beneficios.vue'),
      },
      {
        path: 'tramites',
        name: 'Tramites',
        component: () => import('@/views/Tramites.vue'),
      },
      {
        path: 'Informe',
        name: 'generar-informe',
        component: () => import('@/views/Informe.vue'),
      },
      {
        path: 'apelacion',
        name: 'Apelaciones',
        component: () => import('@/views/Apelaciones.vue'),
      },
      {
        path: 'deudasUsuario',
        name: 'DeudasUsuario',
        component: () => import('@/views/DeudasUsuario.vue'),
      },
      {
        path: 'detalledeuda',
        name: 'DetalleDeuda',
        component: () => import('@/views/DetalleDeuda.vue'),
      },
      {
        path: 'crearapelacion',
        name: 'Crear Apelaciones',
        component: () => import('@/views/CrearApelacion.vue'),
      },
      {
        path: 'notificarDeuda',
        name: 'Notificar Deudas',
        component: () => import('@/views/NotificaView.vue'),
      },
      {
        path: 'beneficioPostular',
        name: 'BeneficioPostular',
        component: () => import('@/views/BeneficioPostular.vue'),
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