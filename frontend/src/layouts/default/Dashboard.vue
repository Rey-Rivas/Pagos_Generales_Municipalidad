<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer
            color="#5A2EA8"
            v-model="drawer"
            :rail="rail"
            permanent
            @click="rail = false"
            >
            <v-list-item
                prepend-avatar="@/assets/pfp.jpg"
                :title="rail ? '' : user_name"
                :subtitle="rail ? '' : user_RUT"
                nav
            >
                <template v-slot:append>
                    <v-btn
                        variant="text"
                        icon="mdi-chevron-left"
                        @click.stop="rail = !rail"
                    ></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.name"
                    :prepend-icon="item.icon"
                    :title="item.name"
                    :to="item.path"
                    :disabled="rail"
                ></v-list-item>
            </v-list>

            </v-navigation-drawer>

            <v-main>
                <router-view></router-view>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        drawer: true,
        rail: true,

        items: [],

        allItems: [
            { name: 'Home', icon: 'mdi-home', path: '/api', tier: 0 },
            { name: 'Mis Deudas', icon: 'mdi-note', path: '/api/deudasUsuario', tier: 1 },
            { name: 'Postular Beneficios', icon: 'mdi-hand-coin', path: '/api/beneficioPostular', tier: 1 },
            { name: 'Explorar Deudas', icon: 'mdi-note-search', path: '/api/deudas', tier: 2 },
            { name: 'Gestionar Beneficios', icon: 'mdi-hand-coin', path: '/api/beneficios', tier: 2 },
            { name: 'Emitir Apelación', icon: 'mdi-file-document-outline', path: '/api/crearapelacion', tier: 1 },
            { name: 'Gestionar Apelaciones', icon: 'mdi-file-document-outline', path: '/api/apelacion', tier: 2 },
            { name: 'Informe de Deudas', icon: 'mdi-file-document-multiple', path: '/api/informe', tier: 2 },
            { name: 'Notificar Deudas', icon: 'mdi-note-alert', path: '/api/notificarDeuda', tier: 2 },
            { name: 'Actualizar Deudas', icon: 'mdi-note-edit', path: '/api/actualizarDeuda', tier: 2 },
            { name: 'Crear Deudas', icon: 'mdi-note-plus', path: '/api/creardeuda', tier: 3 },
            { name: 'Eliminar Deudas', icon: 'mdi-note-minus', path: '/api/eliminarDeuda', tier: 3 },
            { name: 'Crear Trámite', icon: 'mdi-text-box', path: '/api/crearTramite', tier: 3 },
            { name: 'Gestionar Tramites', icon: 'mdi-text-box-edit', path: '/api/tramites', tier: 3 },
            { name: 'Modificar Impuestos', icon: 'mdi-cash', path: '/api/impuesto', tier: 3 },      
            { name: 'Loguearse', icon: 'mdi-login', path: '/login', tier: 0 },
        ],

        userData: localStorage.getItem('userData'),
        user_RUT: localStorage.getItem('user_RUT'),
        user_name: localStorage.getItem('user_name'),
    }),
    methods: {
        filterItemsByRole() {
            const role = localStorage.getItem('role');
            this.items = this.allItems.filter(item => {
                switch (role) {
                    case 'admin':
                        return item.tier !== 1;
                    case 'encargado':
                        return item.tier === 0 || item.tier === 2;
                    case 'user':
                        return item.tier === 0 || item.tier === 1;
                    default:
                        return item.tier === 0;
                }
            }).map(({ name, icon, path }) => ({ name, icon, path }));
        },
    },

    created() {
        this.filterItemsByRole();
        console.log(this.user_RUT);
    },

}
</script>

<style scoped>


#app {
    background-image: url('https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>