import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import HelloMf from '../components/Hellomf.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld
    },
    {
        path: '/hellomf',
        name: 'Hellomf',
        component: HelloMf
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router