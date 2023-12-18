<template>
    <v-form v-model="valid">
        <v-container>

            <v-col cols="12" md="10">
                <h1 class="title">Actualizar Tramites</h1>
            </v-col>
            <v-col cols="12" md="12">
                <text class="subtitle">Selecciona el tramite que quieras actualizar, y modifica.</text>
            </v-col>

            <v-col cols="12" md="12">
                <v-data-table
                    v-model="selectedItem"
                    :items="apelacionList"
                    item-value="_id"
                    show-select
                    select-strategy="single"
                    class="centered-table"
                >
                    <template v-slot:item.documento="{ item }">
                        <a :href="item.documento" target="_blank">{{ item.documento }}</a>
                    </template>
                </v-data-table>
            </v-col>

            <v-divider></v-divider>

            <v-row>
                <v-col cols="12" md="6">
                    <v-combobox
                        v-model="datosApelacion.estado"
                        label="Estado"
                        :items="['Aprobado', 'Rechazado']"
                        required
                    ></v-combobox>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="datosApelacion.observacion"
                        label="Observación"
                        :rules="apelacionRules"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-btn color="#A0C519" @click="actualizarApelacion" :disabled="!valid">Subir Deuda</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import fetchBase from '@/services/fetch';

export default {
    data () {
        return {

            token: localStorage.getItem('token'),
            user_RUT: localStorage.getItem('user_RUT'),

            datosApelacion: {
                _id: '',
                descripcion: '',
                documento: '',
                estado: '',
                deudaID: '',
                RUTUsuario: '',
                RUTEncargado: '',
                observacion: '',
            },        

            valid: true,

            selectedApelacion: null,

            apelacionList: [],
            selectedItem: '',

            apelacionRules: [
                value => {
                    if (value) return true
                    return 'La apelación es requerida.'
                },
                value => {
                    if (typeof value === 'string') return true
                    return 'La apelación debe ser un string.'
                },
            ],
        }
    },
    methods: {

        async getApelaciones() {
            try {
                const apelacionList = await fetchBase(`/apelacion`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                //I want to get only the estado and observacion
                this.apelacionList = apelacionList.data
                console.log('Apelaciones:', this.apelacionList);

            } catch (error) {
                console.log('Error al obtener las apelaciones:', error);
            }
        },

        imprimirCosos() {
            console.log(this.apelacionList);
        },

        async actualizarApelacion() {
            try {
                const requestBody = {
                    descripcion: this.datosApelacion.descripcion,
                    documento: this.datosApelacion.documento,
                    estado: this.datosApelacion.estado.toLowerCase(),
                    deudaID: this.datosApelacion.deudaID,
                    RUTUsuario: this.datosApelacion.RUTUsuario,
                    RUTEncargado: this.user_RUT,
                    observacion: this.datosApelacion.observacion,
                };

                console.log('Sending request with body:', requestBody);

                const response = await fetchBase(`/apelacion/${this.datosApelacion._id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                    body: JSON.stringify(requestBody),
                });

                console.log(response);
                this.$root.showSnackBar('success', 'Apelación actualizada', 'La apelación ha sido actualizada exitosamente.', 'OK');
                this.getApelaciones();

            } catch (error) {
                console.log('Error al actualizar apelación:', error);
                this.$root.showSnackBar('error', 'Error al actualizar apelación', 'Ha ocurrido un error al actualizar la apelación.', 'OK');
            }
        },
        },

        mounted() {
            this.getApelaciones();
        },
        watch: {
            selectedItem: function() {
                console.log("holaaaa");
                this.selectedApelacion = this.apelacionList.find(apelacion => apelacion._id == this.selectedItem);
                console.log('selectedApelacion');
                console.log(this.selectedApelacion);

                if (this.selectedApelacion) {
                    let hasObservacion = false;
                    for (let key in this.datosApelacion) {
                        if (key in this.selectedApelacion) {
                            this.datosApelacion[key] = this.selectedApelacion[key];
                            if (key === 'observacion') {
                                hasObservacion = true;
                            }
                        }
                    }
                    if (!hasObservacion) {
                        this.datosApelacion.observacion = null;
                    }
                }
            },
        },
    }
</script>

<style scoped>
.v-divider {
    margin-bottom: 20px;
}
</style>