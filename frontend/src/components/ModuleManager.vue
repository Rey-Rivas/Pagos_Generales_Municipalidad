<template>
    <div class="login">
        <v-form fast-fail class="form" ref="formLogin">
            <v-row>

                <v-row class="d-flex align-center ml-2">
                    <v-icon class="iconomodulo">mdi-view-module</v-icon>
                    <v-col cols="10">
                        <v-card-title>Mantenedor de módulos del sistema</v-card-title>
                    </v-col>
                </v-row>

                <v-row class="d-flex justify-end">
                    <v-col cols="12" justify="center">
                    <input class="botoncrear" type="button" value="+ Crear nuevo módulo" @click="handleCreate" />
                </v-col>
                </v-row>

                <v-col cols="12">
                    <v-text-field class="modulesearch" v-model="module_search" label="Buscar"
                    clearable counter required :append-inner-icon="'mdi-magnify'"></v-text-field>
                </v-col>

                <v-data-table :headers="headers" :items="searchedItems" :items-per-page="itemsPerPage">
                    <template v-slot:item.active="{ item }">
                        <v-chip label :color="item.active === 'ACTIVO' ? 'success' : 'warning'">
                            {{ item.active }}
                        </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon="mdi-dots-vertical" elevation="0"></v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="handleEdit(item)">
                                    <v-list-item-title>Editar</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="handleUpdate(item)">
                                    <v-list-item-title>Cambiar Estado</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="handleDelete(item)">
                                    <v-list-item-title>Eliminar</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>

            </v-row>
        </v-form>
    </div>
    <UpdateModule ref="updateModule" @update-complete="loadItems" />
</template>

<script>
import Rules from '@/util/form.util';
import UpdateModule from '../modal/UpdateModule.vue';
import ApplicationService from '@/services/application/application.service';

export default {
    components: {
        UpdateModule,
    },
    watch: {
        module_search() {
            this.filterItems();
            console.log("Hola!")
        }
    },
    data() {
        return {
            applicationService: new ApplicationService(),
            passVisible: false,

            passRules: Rules.password,
            emailRules: Rules.email,
            password: '',

            isLoading: false,

            module_search: '',

            selectedApp: null,

            states: ['ACTIVO', 'INACTIVO'],
            selectedStatus: null,

            itemsPerPage: 25,

            headers: [
                { title: 'Aplicación', key: 'appName', width: '200px' },
                { title: 'Módulo', key: 'name', width: '180px'},
                { title: 'Descripción', key: 'description'},
                { title: 'Estado', key: 'active', width: '150px'},
                { title: 'Acciones', key: 'actions', align: 'start', sortable: false, width: '150px'}
            ],

            items: [],
            searchedItems: [],
        }
    },

    async mounted() {
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
    },

    methods: {
        async loadItems() {
            this.isLoading = true;
            try {
                const response = await this.applicationService.getAllModules();
                if (response.code === 1) {
                    // Flatten the items array
                    this.items = response.results.reduce((acc, app) => {
                        const modules = app.role.map(module => ({
                            ...module,
                            appName: app.appName,
                            appId: app.appId,
                            active: module.active ? 'ACTIVO' : 'INACTIVO',
                        }));
                        return acc.concat(modules);
                    }, []);
                    this.searchedItems = this.items;
                } else {
                    this.$root.showSnackBar('error', 'Error', response.message);
                }
                this.isLoading = false;
            } catch (e) {
                this.$root.showSnackBar('error', 'Error', e.message);
                this.isLoading = false;
            }
        },
        filterItems() {
            if (this.module_search) {
                this.searchedItems = this.items.filter(item =>
                    item.name.toLowerCase().includes(this.module_search.toLowerCase())
                );
            } else {
                this.searchedItems = this.items;
            }
        },
        handleCreate() {
            this.$router.push('/app/appList');
        },
        handleUpdate(item) {
            this.$refs.updateModule.open(item);
            console.log(item);
        },
        handleDelete(item) {
            this.$refs.deleteModule.open(item);
        },
    }
}
</script>

<style lang="scss" scoped>

.login {
    padding: 1rem;
}

.form {
    margin: 0rem auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-width: 500px;
    max-width: 100%;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    padding: 25px;
    box-shadow: 0 2px 12px 2px rgba(0, 0, 0, 0.25);
}

.texto {
    text-align: left;
}

.botoncrear {
    background: #1976D2;
    border: none;
    color: white;
    margin-top: 0rem;
    padding: 0.6rem 0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 3px;
    width: 90%;
    margin-top: -1rem;
    margin-left: 6%;

    &:hover {
        background: #3BA3E3;
    }
}

.modulesearch {
    margin-top: 1rem;
    width: 60%;
    margin-left: 40%;
}

.stateSelector {
    width: 80%;
    align-self: flex-end;
}

.form-input {
    border-radius: 5px;
    margin-top: 2rem;
    padding: 10px 15px;
    background: none;
    background-image: none;
    border: 1px solid;
    color: #ABABAB;

    width: 100%;
    box-sizing: border-box;

    margin-top: 3rem;

    &::placeholder {
        color: #353535;
        /* Set the placeholder text color here */
    }

    &:focus {
        outline: 0;
        border-color: #7097e0;
    }
}

.form-submit {
    background: #1976D2;
    border: none;
    color: white;
    margin-top: 2rem;
    padding: 0.6rem 0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 3px;
    width: 50%;
    align-self: flex-end;

    &:hover {
        background: #3BA3E3;
    }
}

.form-create {
    background: #ffffff;
    border: 1px solid;
    border-color: #3b92e3;
    color: #3b92e3;
    margin-top: 1rem;
    padding: 0.6rem 0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 3px;

    &:hover {
        background: #b6dcf3;
    }
}
</style>
