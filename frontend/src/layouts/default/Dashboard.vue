<template>
    <v-app>
        <v-app-bar app>
            <v-app-bar-nav-icon @click="showDrawer = !showDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Dashboard</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="showDrawer" app>
            <v-list dense>
                <v-list-item link v-for="item in items" :key="item.name" :to="item.path">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        showDrawer: false,

        items: [],

        allItems: [
            { name: 'Home', icon: 'mdi-home', path: '/api', tier: 3 },
            { name: 'Usuarios', icon: 'mdi-account', path: '/api/users', tier: 3 },
            { name: 'Login', icon: 'mdi-login', path: '/login', tier: 1 },
        ],
    }),
    methods: {
        filterItemsByRole() {
            const role = localStorage.getItem('role');
            let maxTier;
            switch (role) {
                case 'admin':
                    maxTier = 3;
                    break;
                case 'encargado':
                    maxTier = 2;
                    break;
                case 'user':
                    maxTier = 1;
                    break;
                default:
                    maxTier = 0;
            }
            this.items = this.allItems
                .filter(item => item.tier <= maxTier)
                .map(({ name, icon, path }) => ({ name, icon, path }));
        },
    },
    created() {
        this.filterItemsByRole();
    },
}
</script>