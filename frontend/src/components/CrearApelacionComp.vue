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
                    <v-text-field
                        v-model="datosApelacion.documento"
                        :rules="documentoRules"
                        label="Documento"
                        required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-btn color="#A0C519" @click="postApelacion" :disabled="!valid">Subir Apelación</v-btn>
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
            documentoRules: [
                value => {
                    if (value) return true
                    return 'El documento es requerido.'
                },
                value => {
                    if (typeof value === 'string') return true
                    return 'El documento debe ser un string.'
                },
                value => {
                    // Regular expression for a basic validation of a URL
                    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
                        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                        '(\\:\\d+)?'+ // port
                        '(\\/[-a-z\\d%_.~+]*)*'+ // path
                        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                    if (!!pattern.test(value)) return true
                    return 'El documento debe ser un hyperlink.'
                },
            ],

    }),
    methods: {
        async postApelacion() {
            try {
                const deuda = this.deudaList.find(deuda => deuda.descripcion === this.datosApelacion.deudaSel);

                const requestBody = {
                        descripcion: this.datosApelacion.descripcion,
                        documento: this.datosApelacion.documento,
                        estado: 'pendiente',
                        deudaID: deuda ? deuda._id : null,
                        RUTUsuario: this.user_RUT,
                    };

                console.log('Sending request with body:', requestBody);

                const deudaList = await fetchBase(`/apelacion`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                    body: JSON.stringify(requestBody),
                });

                this.$root.showSnackBar('success', 'Success', 'Apelación posteada. Buena suerte!');
                console.log(deudaList);
            } catch (error) {
                console.log('Error al obtener las deudas', error);
                this.$root.showSnackBar('error', 'Error', 'No se posteó la apelación.');
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
                for (const deuda of deudaList.data) {
                    if (deuda.RUTUsuario == this.user_RUT) {
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
        },

        printito(){
            console.log(this.datosApelacion.documento);
            console.log(this.datosApelacion.documento[0]);
        }
    },
    created() {
        this.getDeudas();
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