<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <h1 class="title">Crear trámite</h1>
                </v-col>

                <v-col cols="12" md="8">
                    <v-text-field
                        v-model="datosTramite.nombreTramite"
                        :rules="nombreTramiteRules"
                        label="Nombre del trámite"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model.number="datosTramite.montoFijo"
                        :rules="montoFijoRules"
                        label="Monto fijo"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                    <v-text-field
                        v-model="datosTramite.descripcionTramite"
                        :rules="descripcionTramiteRules"
                        label="Descripción del trámite"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field
                        v-model.number="datosTramite.tramiteID"
                        :rules="tramiteIDRules"
                        label="ID del trámite"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-combobox
                        v-model="adminSelComputed"
                        label="Administrador"
                        :items="userList.map(user => `${user.username} (${user.RUT})`)"
                        required
                    ></v-combobox>
                </v-col>

                <v-col cols="12" md="10">
                    <v-btn color="#A0C519" @click="subirTramite" >Subir Trámite</v-btn>
                </v-col>
                
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import { ref } from 'vue';
import fetchBase from '@/services/fetch';

export default {
    data: () => ({
        token: localStorage.getItem('token'),
        user_RUT: localStorage.getItem('user_RUT'),

        datosTramite: {
            tramiteID: 0,
            montoFijo: 0,
            nombreTramite: '',
            descripcionTramite: '',
            RUTAdmin: '',
        },

        valid: false,

        userList: [],

        tramiteIDRules: [
            value => {
                if (value) return true
                return 'El ID del trámite es requerido.'
            },
            value => {
                if (typeof value === 'number') return true
                return 'El ID del trámite debe ser un número.'
            },
        ],
        montoFijoRules: [
            value => {
                if (value) return true
                return 'El monto fijo es requerido.'
            },
            value => {
                if (typeof value === 'number') return true
                return 'El monto fijo debe ser un número.'
            },
        ],
        nombreTramiteRules: [
            value => {
                if (value) return true
                return 'El nombre del trámite es requerido.'
            },
            value => {
                if (typeof value === 'string') return true
                return 'El nombre del trámite debe ser un string.'
            },
        ],
        descripcionTramiteRules: [
            value => {
                if (value) return true
                return 'La descripción del trámite es requerida.'
            },
            value => {
                if (typeof value === 'string') return true
                return 'La descripción del trámite debe ser un string.'
            },
        ],
    }),
    methods: {
        async subirTramite() {
            try {
                const data = await fetchBase('/tramite', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                    body: JSON.stringify({
                        tramiteID: this.datosTramite.tramiteID,
                        montoFijo: this.datosTramite.montoFijo,
                        nombreTramite: this.datosTramite.nombreTramite,
                        descripcionTramite: this.datosTramite.descripcionTramite,
                        RUTAdmin: this.datosTramite.RUTAdmin,
                    }),
                });
                console.log('Trámite subido exitosamente!');
                console.log('Trámite:', data.data);
                this.$root.showSnackBar('success', 'Success', 'Trámite subido exitosamente!');

                this.datosTramite.tramiteID = 0;
                this.datosTramite.montoFijo = 0;
                this.datosTramite.nombreTramite = '';
                this.datosTramite.descripcionTramite = '';
                this.datosTramite.RUTAdmin = '';

            } catch (error) {
                console.log('Error al subir el trámite:', error);
                this.$root.showSnackBar('error', 'Error', 'Error al subir el trámite: ' + error);
            }
        },

        async getUsers() {
            try {
                const userList = await fetchBase(`/users`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                // Filter the users by their role
                this.userList = [];
                for (let user of userList.data) {
                    const roleData = await fetchBase(`/users/checkRoles/${user.email}`, {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                    });
                    if (roleData.data.role === 'admin') {
                        this.userList.push(user);
                    }
                }
                console.log('Usuarios:', this.userList);

            } catch (error) {
                console.log('Error al obtener los usuarios:', error);
            }
        },
    },
    created() {
        this.getUsers();
    },
    computed: {
        adminSelComputed: {
            get() {
                const user = this.userList.find(user => user.RUT === this.datosTramite.RUTAdmin);
                return user ? `${user.username} (${user.RUT})` : '';
            },
            set(value) {
                const RUT = value.split(' ').pop().slice(1, -1); // Extracts the RUT from the string
                this.datosTramite.RUTAdmin = RUT;
            }
        }
    },
}
</script>

<style scoped>
.label-container {
    display: flex;
    justify-content: left;
}

.dim-label {
    color: #888; /* Adjust this value to make the text dimmer or brighter */
    padding-top: 7px;
}

.title {
    font-size: 32px; /* Adjust this value to make the text bigger or smaller */
    font-weight: bold; /* Makes the text bold */
}
</style>