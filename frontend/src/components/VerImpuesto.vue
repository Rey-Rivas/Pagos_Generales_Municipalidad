<template>
    <v-container>
        <v-card>
            <v-text-field label="Impuesto" v-model="ImpuestoNuevo" class="color-tertiary"></v-text-field>
        </v-card>
        <v-btn @click="ModificarImpuesto" class="BotonPagar">Modificar</v-btn>
        <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Impuesto editado exitosamente</v-card-title>
                <v-card-text>
                    <!-- Muestra el monto pagado, la descripción de la deuda y la fecha actual -->
                    <div>Nuevo impuesto: {{ ImpuestoNuevo }}</div>
                </v-card-text>
                <v-card-actions>
                    <!-- Modifica el botón "Aceptar" para redirigir a 'detalledeuda' -->
                    <v-btn color="primary" @click="redirectToHome">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import fetchBase from '@/services/fetch';
export default {
    data() {
        return {
            ImpuestoResults: [],
            ImpuestoNuevo: '',
            confirmDialog: false,
        };
    },
    methods: {
        async buscarImpuesto() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetchBase(`/deudas/obtenerImpuesto/getImpuesto`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    }
                });
                console.log("datos response: ", response);
                this.ImpuestoResults = Array.isArray(response) ? response : [response];
                console.log("datos deudaResults: ", this.ImpuestoResults[0]);
                this.ImpuestoNuevo = this.ImpuestoResults[0].Valorimpuesto;
            } catch (error) {
                console.error(error);
            }
        },
        redirectToHome() {
            this.confirmDialog = false;
        },
        async ModificarImpuesto() {
            const token = localStorage.getItem('token');
            const nuevoImpuesto = this.ImpuestoNuevo;
            const response = await fetchBase(`/deudas/ActualizarImpuesto/${nuevoImpuesto}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });
            this.confirmDialog = true;
        }


    },
    created() {
        this.buscarImpuesto();
    },



}


</script>