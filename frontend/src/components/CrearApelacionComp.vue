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
                        :items="deudaList.map(deuda => deuda.descripcion)"
                        required
                    ></v-combobox>
                </v-col>

                <v-col cols="12" md="5">
                    <v-combobox
                        v-model="datosApelacion.estado"
                        label="Estado"
                        :items="['Pendiente']"
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
                documento: null,
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
        async uploadFile(event) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetchBase('/upload.route', {
                method: 'POST',
                body: formData,
                });

                console.log('File uploaded:', response);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        },

        async subirApelacion(){
            try{
                const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);

                console.log({
                    descripcion: this.datosApelacion.descripcion,
                    deudaID: deuda ? deuda._id : null,
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
                        deudaID: deuda ? deuda._id : null,
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
                    const deudaData = await fetchBase(`/deudas/usuario/${this.user_RUT}`, {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                    });
                    if (deudaData.data.RUT === this.user_RUT) {
                        this.deudaList.push(deuda);
                    }
                };
                console.log('Deudas:', deudaList.data);
            }catch(error){
                console.log('Error al obtener las deudas',error);
            }
        },

        async printDeudas() {
            const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);

            console.log({
                    descripcion: this.datosApelacion.descripcion,
                    deudaID: deuda ? deuda._id : null,
                    estado: this.datosApelacion.estado,
                    documento: this.datosApelacion.documento,
                    RUTUsuario: this.user_RUT,
                });
        }
    },
    created() {
        //this.getDeudas();
    },
    computed: {
        deudaSelComputed: {
            get() {
                const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);
                return deuda ? `${deuda.descripcion}` : '';
            },
            set(value) {
                const descripcion = value.split(' ').pop().slice(1, -1); // Extracts the RUT from the string
                this.datosApelacion.deudaSel = descripcion;
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