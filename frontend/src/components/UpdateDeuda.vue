<template>
    <v-form v-model="valid">
        <v-container>

            <v-col cols="12" md="10">
                <h1 class="title">Actualizar Deudas</h1>
            </v-col>
            <v-col cols="12" md="12">
                <text class="subtitle">Selecciona la deuda que quieras actualizar, y modifica.</text>
            </v-col>

            <v-col cols="12" md="12">
                <v-data-table v-model="selectedItem" :items="deudaList" item-value="_id" show-select
                    select-strategy="single" class="centered-table" @input="setDefaultValues"></v-data-table>
            </v-col>

            <v-divider></v-divider>

            <v-row>
                <v-col cols="12" md="8">
                    <v-text-field v-model="datosDeuda.description" :rules="descriptionRules" label="Descripción"
                        required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model.number="datosDeuda.monto" :rules="montoRules" label="Monto a pagar"
                        required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="datosDeuda.fechaEmision" label="Fecha de Emisión" type="date" required
                        :rules="dateRulesEmision" :error-messages="dateErrorsEmision"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="datosDeuda.fechaVencimiento" label="Fecha de Vencimiento" type="date" required
                        :min="datosDeuda.fechaEmision" :rules="dateRulesVencimiento"
                        :error-messages="dateErrorsVencimiento"></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-combobox v-model="datosDeuda.estado" label="Estado"
                        :items="['Pendiente', 'Pendiente Justificado', 'Aprobado', 'Rechazado', 'Pagado', 'Fuera de plazo']"
                        required></v-combobox>
                </v-col>
                <v-col cols="12" md="6">
                    <v-combobox v-model="datosDeuda.tramiteSel" label="Trámite"
                        :items="tramiteList.map(tramite => tramite.descripcionTramite)" required></v-combobox>
                </v-col>

                <v-col cols="12" md="4">
                    <v-combobox v-model="adminSelComputed" label="RUT del Admin"
                        :items="adminList.map(user => `${user.username} (${user.RUT})`)" required></v-combobox>
                </v-col>
                <v-col cols="12" md="4">
                    <v-combobox v-model="userSelComputed" label="RUT de Usuario"
                        :items="userList.map(user => `${user.username} (${user.RUT})`)" required></v-combobox>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="datosDeuda.fechaPago" label="Fecha de Pago" type="date"
                        :min="datosDeuda.fechaEmision" :rules="dateRulesPago"
                        :error-messages="dateErrorsPago"></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-btn color="#A0C519" @click="actualizarDeuda" :disabled="!valid">Subir Deuda</v-btn>
                </v-col>
                <v-col cols="12" md="4">
                    <v-btn color="#A0C519" @click="imprimirCosos">imprimirCosos</v-btn>
                </v-col>

            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import fetchBase from '@/services/fetch';

export default {
    data() {
        return {

            hoy: new Date().toISOString().substr(0, 10),
            token: localStorage.getItem('token'),
            user_RUT: localStorage.getItem('user_RUT'),

            dateErrorsEmision: [],
            dateErrorsVencimiento: [],
            dateErrorsPago: [],
            dateErrors: [],

            datosDeuda: {
                description: '',
                monto: 0,
                fechaEmision: '',
                fechaVencimiento: '',
                estado: 'Pendiente',
                tramiteSel: '',
                userSel: '',
                adminSel: '',
                fechaPago: '',
            },

            valid: false,

            fechaExpire: null,
            selectedDeuda: null,

            tramiteList: [],
            userList: [],
            adminList: [],

            deudaList: [],
            selectedItem: '',

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
            dateRulesEmision: [
                value => {
                    if (value) return true
                    return 'La fecha es requerida.'
                },
            ],
            dateRulesVencimiento: [
                value => {
                    if (value) return true
                    return 'La fecha es requerida.'
                },
                value => {
                    const inputDate = new Date(value);
                    const minDate = new Date(this.datosDeuda.fechaEmision);
                    if (inputDate.setHours(0, 0, 0, 0) >= minDate.setHours(0, 0, 0, 0)) return true
                    return 'La fecha no puede ser antes de la fecha de emisión.'
                },
            ],
            dateRulesPago: [
                value => {
                    const inputDate = new Date(value);
                    const minDate = new Date(this.datosDeuda.fechaEmision);
                    if ((inputDate.setHours(0, 0, 0, 0) >= minDate.setHours(0, 0, 0, 0)) || value == null) return true
                    return 'La fecha no puede ser antes de la fecha de emisión.'
                },
            ],
        }
    },
    methods: {
        setDefaultValues() {
            console.log("holaaaa");
            this.selectedDeuda = this.deudaList.find(deuda => deuda._id == this.selectedItem);
            console.log('selectedDeuda');
            console.log(this.selectedDeuda);

            if (this.selectedDeuda) {
                this.datosDeuda.adminSel = this.selectedDeuda.RUTAdmin;
                this.datosDeuda.userSel = this.selectedDeuda.RUTUsuario;
                this.datosDeuda.description = this.selectedDeuda.descripcion;
                this.datosDeuda.estado = this.selectedDeuda.estado;
                this.datosDeuda.monto = this.selectedDeuda.monto;
                this.datosDeuda.tramiteSel = this.selectedDeuda.tramiteID;

                // This does not work because fechaEmision is on the DD/MM/YYYY format, and the datepicker expects YYYY-MM-DD
                this.datosDeuda.fechaEmision = this.reFecha(this.selectedDeuda.fechaEmision);
                this.datosDeuda.fechaVencimiento = this.reFecha(this.selectedDeuda.fechaVencimiento);
                if (this.selectedDeuda.fechaPago) {
                    this.datosDeuda.fechaPago = this.reFecha(this.selectedDeuda.fechaPago);
                } else {
                    this.datosDeuda.fechaPago = null;
                }
            }
        },
        validateDateEmision() {
            this.dateErrorsEmision = [];
            for (let rule of this.dateRulesEmision) {
                let result = rule(this.datosDeuda.fechaEmision);
                if (typeof result === 'string') {
                    this.dateErrorsEmision.push(result);
                }
            }
        },
        validateDateVencimiento() {
            this.dateErrorsVencimiento = [];
            for (let rule of this.dateRulesVencimiento) {
                let result = rule(this.datosDeuda.fechaVencimiento);
                if (typeof result === 'string') {
                    this.dateErrorsVencimiento.push(result);
                }
            }
        },
        validateDatePago() {
            this.dateErrorsPago = [];
            for (let rule of this.dateRulesPago) {
                let result = rule(this.datosDeuda.fechaPago);
                if (typeof result === 'string') {
                    this.dateErrorsPago.push(result);
                }
            }
        },

        async getTramitesyUsuarios() {
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
                this.adminList = [];

                for (let user of userList.data) {
                    const roleData = await fetchBase(`/users/checkRoles/${user.email}`, {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                    });
                    if (roleData.data.role === 'user') {
                        this.userList.push(user);
                    } else if (roleData.data.role === 'admin') {
                        this.adminList.push(user);
                    }
                }
                console.log('Usuarios dps:', this.userList);

            } catch (error) {
                console.log('Error al obtener los tramites:', error);
            }
        },

        async getDeudas() {
            try {
                const deudaList = await fetchBase(`/deudas`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                this.deudaList = deudaList.data.map(({ __v, ...rest }) => rest);
                console.log('Deudas:', this.deudaList);

            } catch (error) {
                console.log('Error al obtener los tramites:', error);
            }
        },

        imprimirCosos() {
            console.log(this.deudaList);
        },

        reFecha(dateString) {
            let parts = dateString.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        },

        async actualizarDeuda() {
            try {
                const requestBody = {
                    descripcion: this.datosDeuda.description,
                    monto: this.datosDeuda.monto,
                    fechaEmision: this.datosDeuda.fechaEmision,
                    fechaVencimiento: this.datosDeuda.fechaVencimiento,
                    estado: this.datosDeuda.estado,
                    tramiteID: this.datosDeuda.tramiteSel,
                    RUTUsuario: this.datosDeuda.userSel,
                    RUTAdmin: this.datosDeuda.adminSel,
                    fechaPago: this.datosDeuda.fechaPago,
                };

                console.log('Sending request with body:', requestBody);

                const response = await fetchBase(`/deudas/${this.selectedItem}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                    body: JSON.stringify(requestBody),
                });

                console.log(response);
                this.$root.showSnackBar('success', 'Deuda actualizada', 'La deuda ha sido actualizada exitosamente.', 'OK');
                this.getDeudas();

            } catch (error) {
                console.log('Error al actualizar deuda:', error);
                this.$root.showSnackBar('error', 'Error al actualizar deuda', 'Ha ocurrido un error al actualizar la deuda.', 'OK');
            }
        },
    },
    created() {
        this.setDefaultValues();
    },
    mounted() {
        this.setDefaultValues();
        this.getDeudas();
        this.getTramitesyUsuarios();
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
        },
        adminSelComputed: {
            get() {
                const user = this.adminList.find(user => user.RUT === this.datosDeuda.adminSel);
                return user ? `${user.username} (${user.RUT})` : '';
            },
            set(value) {
                const RUT = value.split(' ').pop().slice(1, -1); // Extracts the RUT from the string
                this.datosDeuda.adminSel = RUT;
            }
        }
    },
}
</script>

<style scoped>
.v-divider {
    margin-bottom: 20px;
}
</style>