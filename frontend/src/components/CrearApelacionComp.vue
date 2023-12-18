<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <h1 class="title">Crear apelación</h1>
                </v-col>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="datosApelacion.descripcion"
                        :rules="descriptionRules"
                        label="Descripción"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="5">
                    <v-combobox
                        v-model="datosApelacion.deudaSel"
                        label="Deudas"
                        required
                    ></v-combobox>
                </v-col>

                <v-col cols="12" md="5">
                    <v-combobox
                        label="Estado"
                        disabled="true"
                        :items="['Pendiente', 'Pendiente Justificado', 'Aprobado', 'Rechazado', 'Pagado', 'Fuera de plazo']"
                        required
                    ></v-combobox>
                </v-col>
                <v-col cols="12" md="5">
                <v-file-input
                    label="Documento"
                    required
                ></v-file-input>
                </v-col>

                <v-col cols="12" md="10">
                    <v-btn color="#A0C519" @click="subirApelacion" :disabled="!valid">Subir Apelación</v-btn>
                </v-col>
                
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import fetchBase from '@/services/fetch'

    export default {
        data:() => ({
            token: localStorage.getItem('token'),
            user_RUT: localStorage.getItem('user_RUT'),

            datosApelacion: {
                descripcion: '',
                deudaSel: '',
                estado: 'Pendiente',
                documento: '',
             },        
            valid: false,

            deudaSel: '',

            deudaList: [],
            
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

    }),
    methods: {
        async subirApelacion(){
            try{
                const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);

                console.log({
                    descripcion: this.datosApelacion.descripcion,
                    deudaID: deuda ? deuda.deudaID : null,
                    estado: this.datosApelacion.estado,
                    documento: this.datosApelacion.documento,
                    RUTUsuario: this.user_RUT,
                })

                const data = await fetchBase('/apelacion', {
                    method: 'POST',
                    Headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                    body: JSON.stringify({
                        descripcion: this.datosApelacion.descripcion,
                        deudaID: deuda ? deuda.deudaID : null,
                        estado: this.datosApelacion.estado.toLocaleLowerCase(),
                        documento: this.datosApelacion.documento,
                        RUTUsuario: this.user_RUT,
                    }),
                });
                console.log('Apelación subida éxitosamente');
                console.log('Apelación:', data.data);
                this.$root.showSnackBar('success', 'Success', 'Apelación subida exitosamente!');
                
                this.datosApelacion.descripcion = '';
                this.datosApelacion.estado = 'Pendiente';
                this.datosApelacion.deudaSel = '';
                this.datosApelacion.documento = '';
            }catch(error){
                console.log('Error al crear la apelación',error);
                this.$root.showSnackBar('error', 'Error', 'Error al crear la apelación');
            }
        },

        async getDeudas(){
            try {
                const deudaList = await fetchBase(`/deudas`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                this.deudaList = [];
                for (let deuda of deudaList.data) {
                    const deudaData = await fetchBase(`/deudas/usuario/${this.rut}`, {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                    });
                    if (deudaData.data.RUT === this.rut) {
                        this.deudaList.push(deuda);
                    }
                }
                console.log('Deudas:', deudaList.data);
            }catch(error){
                console.log('Error al obtener las deudas',error);
            }
        },

        async printDeudas() {
            const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);

            console.log({
                    descripcion: this.datosApelacion.descripcion,
                    deudaID: deuda ? deuda.deudaID : null,
                    estado: this.datosApelacion.estado,
                    documento: this.datosApelacion.documento,
                    RUTUsuario: this.user_RUT,
                });
        }
    },
    created() {
        this.getDeudas();
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