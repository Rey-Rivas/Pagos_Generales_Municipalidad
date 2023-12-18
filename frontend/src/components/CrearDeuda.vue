<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <h1 class="title">Crear deuda</h1>
                </v-col>
                <v-col cols="12" md="8">
                    <v-text-field
                        v-model="datosDeuda.description"
                        :rules="descriptionRules"
                        label="Descripción"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field
                        v-model.number="datosDeuda.monto"
                        :rules="montoRules"
                        label="Monto a pagar"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-combobox
                        v-model="userSelComputed"
                        label="Usuario"
                        :items="userList.map(user => `${user.username} (${user.RUT})`)"
                        required
                    ></v-combobox>
                </v-col>
                <v-col cols="12" md="6">
                    <v-combobox
                        v-model="datosDeuda.tramiteSel"
                        label="Trámite"
                        :items="tramiteList.map(tramite => tramite.descripcionTramite)"
                        required
                    ></v-combobox>
                </v-col>

                <v-col cols="12" md="6">
                    <v-combobox
                        v-model="datosDeuda.estado"
                        label="Estado"
                        :items="['Pendiente', 'Pendiente Justificado', 'Aprobado', 'Rechazado', 'Pagado', 'Fuera de plazo']"
                        required
                    ></v-combobox>
                </v-col>
                <v-col cols="12" md="6">
                <v-text-field
                    v-model="datosDeuda.fechaVencimiento"
                    label="Fecha"
                    type="date"
                    required
                    :min="hoy"
                    :rules="dateRules"
                    :error-messages="dateErrors"
                ></v-text-field>
                </v-col>

                <v-col cols="12" md="10">
                    <v-btn color="#A0C519" @click="subirDeuda" :disabled="!valid">Subir Deuda</v-btn>
                </v-col>
                
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref();
</script>

<script>
import { ref } from 'vue';
import fetchBase from '@/services/fetch';

export default {
    data: () => ({

        hoy: new Date().toISOString().substr(0, 10),
        token: localStorage.getItem('token'),
        user_RUT: localStorage.getItem('user_RUT'),
        dateErrors: [],

        datosDeuda: {
            description: '',
            monto: 0,
            fechaEmision: '',
            fechaVencimiento: '',
            estado: 'Pendiente',
            tramiteSel: '',
            userSel: '',
        },        

        valid: false,

        tramiteSel: '',
        userSel: '',
        fechaExpire: null,

        tramiteList: [],
        userList: [],

        descriptionRules: [
            value => {
                if (value) return true
                return 'La descripcion es requerida.'
            },
            value => {
                if (typeof value === 'string') return true
                return 'La descripcion debe ser un string.'
            },
        ],
        montoRules: [
            value => {
                if (value) return true
                return 'El monto es requerido.'
            },
            value => {
                if (typeof value === 'number') return true
                return 'El monto debe ser un número.'
            },
        ],
        emailRules: [
          value => {
            if (value) return true
  
            return 'E-mail is requred.'
          },
          value => {
            if (/.+@.+\..+/.test(value)) return true
  
            return 'E-mail must be valid.'
          },
        ],
        dateRules: [
            value => {
                if (value) return true
                return 'La fecha es requerida.'
            },
            value => {
                const inputDate = new Date(value);
                const today = new Date();
                if (inputDate.setHours(0,0,0,0) >= today.setHours(0,0,0,0)) return true
                return `La fecha no puede ser antes que hoy.`
            },
        ],
      }),
    methods: {
        validateDate() {
            this.dateErrors = [];
            for (let rule of this.dateRules) {
                let result = rule(this.datosDeuda.fechaVencimiento);
                if (typeof result === 'string') {
                    this.dateErrors.push(result);
                }
            }
        },
        async subirDeuda() {
          try {

            const tramite = this.tramiteList.find(tramite => tramite.descripcionTramite === this.datosDeuda.tramiteSel);

            console.log({
                    descripcion: this.datosDeuda.description,
                    monto: this.datosDeuda.monto,
                    fechaEmision: new Date().toISOString().substr(0, 10),
                    fechaVencimiento: this.datosDeuda.fechaVencimiento,
                    estado: this.datosDeuda.estado.toLowerCase(),
                    tramiteID: tramite ? tramite.tramiteID : null,
                    RUTAdmin: this.user_RUT,
                    RUTUsuario: this.datosDeuda.userSel,
                })

            const data = await fetchBase('/deudas', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.token, // replace 'token' with your actual token
                },
                body: JSON.stringify({
                    descripcion: this.datosDeuda.description,
                    monto: this.datosDeuda.monto,
                    fechaEmision: new Date().toISOString().substr(0, 10),
                    fechaVencimiento: this.datosDeuda.fechaVencimiento,
                    estado: this.datosDeuda.estado.toLowerCase(),
                    tramiteID: tramite ? tramite.tramiteID : null,
                    RUTAdmin: this.user_RUT,
                    RUTUsuario: this.datosDeuda.userSel,
                }),
            });
            console.log('Deuda subida exitosamente!');
            console.log('Deuda:', data.data);
            this.$root.showSnackBar('success', 'Success', 'Deuda subida exitosamente!');

            this.datosDeuda.description = '';
            this.datosDeuda.monto = 0;
            this.datosDeuda.fechaVencimiento = '';
            this.datosDeuda.estado = 'Pendiente';
            this.datosDeuda.tramiteSel = '';
            this.datosDeuda.userSel = '';

          } catch (error) {
            console.log('Error al subir la deuda:', error);
            this.$root.showSnackBar('error', 'Error', 'Error al subir la deuda: ' + error);
          }
        },

        async getTramites() {
            try {
                const tramiteList = await fetchBase(`/tramite`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                this.tramiteList = tramiteList.data;
                console.log('Tramites:', tramiteList.data);

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
                    if (roleData.data.role === 'user') {
                        this.userList.push(user);
                    }
                }
                console.log('Usuarios:', this.userList);

            } catch (error) {
                console.log('Error al obtener los tramites:', error);
            }
        },

        async printCosa() {
            const user = this.userList.find(user => user.username === this.datosDeuda.userSel);
            const tramite = this.tramiteList.find(tramite => tramite.descripcionTramite === this.datosDeuda.tramiteSel);

            console.log({
                    descripcion: this.datosDeuda.description,
                    monto: this.datosDeuda.monto,
                    fechaEmision: new Date().toISOString().substr(0, 10),
                    fechaVencimiento: this.datosDeuda.fechaVencimiento,
                    estado: this.datosDeuda.estado,
                    tramiteID: tramite ? tramite.tramiteID : null,
                    RUTAdmin: this.user_RUT,
                    RUTUsuario: this.datosDeuda.userSel,
                });
        },
      },
    created() {
        //this.subirDeuda();
        this.getTramites();
    },
    computed: {
        userSelComputed: {
            get() {
                const user = this.userList.find(user => user.RUT === this.datosDeuda.userSel);
                return user ? `${user.username} (${user.RUT})` : '';
            },
            set(value) {
                const RUT = value.split(' ').pop().slice(1, -1); // Extracts the RUT from the string
                this.datosDeuda.userSel = RUT;
            }
        }
    },
    watch: {
        'datosDeuda.fechaVencimiento': function() {
            this.validateDate();
        },
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