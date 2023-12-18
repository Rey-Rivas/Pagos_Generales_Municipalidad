<template>
    <v-container>
        <!-- Utiliza v-btn-toggle para seleccionar la opción -->
        <v-btn-toggle v-model="selectedOption" class="color-primary">
            <v-btn value="Todas las deudas" class="color-secondary">Todas las deudas</v-btn>
        </v-btn-toggle>

        <!-- Muestra u oculta el cuadro de texto según la opción seleccionada -->
        <v-container v-if="selectedOption === 'Deuda especifica'">
            <v-text-field label="Id deuda" v-model="idDeuda" class="color-tertiary"></v-text-field>
            <v-btn @click="buscarDeuda" class="color-quinary">Buscar</v-btn>
        </v-container>

        <!-- Muestra u oculta el cuadro de texto según la opción seleccionada -->
        <v-container v-if="selectedOption === 'Deuda usuario'">
            <v-text-field label="RUT" v-model="rut" class="color-tertiary"></v-text-field>
            <v-btn @click="buscarDeuda" class="color-quinary">Buscar</v-btn>
        </v-container>

        <v-card>
            <v-row class="manual-column-names color-secondary justify-center align-center">
                <v-col class="column-nameID" :class="{ 'margin-top-10': showTopMargin }">
                    Descripcion
                </v-col>
                <v-col class="column-nameDESCRIPCION" :class="{ 'margin-top-20': showTopMargin }">
                    Monto
                </v-col>
                <v-col class="column-nameMONTO" :class="{ 'margin-top-30': showTopMargin }">
                    Fecha de Emisión
                </v-col>
                <v-col class="column-nameFECHAEMISION" :class="{ 'margin-top-30': showTopMargin }">
                    Fecha de Vencimiento
                </v-col>
                <v-col class="column-nameFECHAVENCIMIENTO" :class="{ 'margin-top-30': showTopMargin }">

                </v-col>
                <!-- Agrega más columnas según sea necesario -->
            </v-row>


            <v-data-table :headers="headers" :items="deudaResults" class="color-quaternary">
                <template v-slot:item._id="{ item }">{{ item._id }}</template>
                <template v-slot:item.descripcion="{ item }">{{ item.descripcion }}</template>
                <template v-slot:item.monto="{ item }">{{ item.monto }}</template>
                <template v-slot:item.fechaEmision="{ item }">{{ item.fechaEmision }}</template>
                <template v-slot:item.fechaVencimiento="{ item }">{{ item.fechaVencimiento }}</template>
                <template v-slot:item.estado="{ item }">{{ item.estado }}</template>
                <template v-slot:item.tramiteID="{ item }">{{ item.tramiteID }}</template>
                <template v-slot:item.RUTAdmin="{ item }">{{ item.RUTAdmin }}</template>
                <template v-slot:item.RUTUsuario="{ item }">{{ item.RUTUsuario }}</template>
                <template v-slot:item.acciones="{ item }">
                    <v-btn v-if="parseInt(item.monto) > 0" @click="buscarBeneficio(item)"
                        class="BotonPagar">Postular</v-btn>
                    <v-dialog v-model="confirmDialog" max-width="400">
                        <v-card>
                            <v-card-title class="headline">Postular a beneficio</v-card-title>
                            <v-card-text>
                                <v-text-field label="Nombre del beneficio" v-model="nombreBeneficio"
                                    class="color-tertiary"></v-text-field>
                                <v-text-field label="Breve descripcion" v-model="descripcionBeneficio"
                                    class="color-tertiary"></v-text-field>
                                <v-text-field label="Monto" v-model="montoBeneficio" class="color-tertiary"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <!-- Modifica el botón "Aceptar" para redirigir a 'detalledeuda' -->
                                <v-btn color="primary" @click="CrearBeneficio">Aceptar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="beneficioCreadoDialog" max-width="400">
                        <v-card>
                            <v-card-title class="headline">Beneficio creado exitosamente</v-card-title>
                            <v-card-text>
                               <div>Nombre del beneficio: {{ nombreBeneficio }}</div>
                            </v-card-text>
                            <v-card-actions>
                                <!-- Modifica el botón "Aceptar" para redirigir a 'detalledeuda' -->
                                <v-btn color="primary" @click="VolverMenu">Aceptar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>
  
<script>
import fetchBase from '@/services/fetch';

export default {
    data() {
        return {
            confirmDialog: false,
            beneficioCreadoDialog: false,
            deudaResults: [],
            selectedOption: 'Todas las deudas', // Inicializa la opción seleccionada
            rut: '',
            idDeuda: '',
            nombreBeneficio: '',
            descripcionBeneficio: '',
            montoBeneficio: '',
            headers: [
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Monto', value: 'monto' },
                { text: 'Fecha de Emisión', value: 'fechaEmision' },
                { text: 'Fecha de Vencimiento', value: 'fechaVencimiento' },
                { text: 'Acciones', value: 'acciones' },
            ],
        };
    },
    watch: {
        // Observa cambios en la opción seleccionada
        selectedOption() {
            // Resetea los valores de los campos cuando cambia la opción
            this.rut = '';
            this.idDeuda = '';

            // Llama a la función para cargar los datos de la deuda
            this.buscarDeuda();
        },
    },
    methods: {
        async buscarDeuda() {
            try {
                const token = localStorage.getItem('token');
                const rut = localStorage.getItem('user_RUT');
                if (!token) {
                    console.error('Token no disponible. Inicia sesión primero.');
                    return;
                }

                let response;

                response = await fetchBase(`/deudas/usuario/${rut}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                });
                console.log('Respuesta completa del servidor:', response);
                this.deudaResults = Array.isArray(response.data) ? response.data : [response.data];
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        },
        VolverMenu() {
      this.$router.push('deudasUsuario');
    },

        buscarBeneficio(item) {
            localStorage.setItem('deudaID', item._id);
            console.log('ID de la deuda:', item._id);
            console.log('Dialogo antes:', this.confirmDialog);
            this.confirmDialog = true;
            console.log('Dialogo:', this.confirmDialog);
        },
        async CrearBeneficio() {
            const token = localStorage.getItem('token');
            const rut = localStorage.getItem('user_RUT');
            const deudaID = localStorage.getItem('deudaID');
            if (!token) {
                console.error('Token no disponible. Inicia sesión primero.');
                return;
            }
            let response;

            response = await fetchBase(`/beneficios`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreBeneficio: this.nombreBeneficio,
                    descripcion: this.descripcionBeneficio,
                    monto: this.montoBeneficio,
                    estado: "pendiente",
                    idDeuda: deudaID,
                    RUTUsuario: rut,
                }),
            });
            this.confirmDialog = false;
            this.beneficioCreadoDialog = true;
        },
    },
    created() {
        // Llama a la función para cargar los datos de la deuda cuando el componente se crea
        this.buscarDeuda();
    },
};
</script>
  
<style scoped>
.color-primary {
    color: #F3F3FB;
}

.color-secondary {
    background-color: #55D0C5;
    color: #F3F3FB;
}

.color-tertiary {
    background-color: #F3F3FB;
    color: #000000;
}

.color-quaternary {
    text-align: left;
    width: 700px;
    background: #F3F3FB;
    color: #000000;
}

.color-quinary {
    background-color: #F3F3FB;
    color: #5A2EA8;
}

/* Agrega un estilo para las celdas de la tabla */
.cell {
    text-align: start;
    border: 1px solid #F3F3FB;
    /* Ajusta el color del borde según sea necesario */
}

.column-nameID {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 20px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
    max-width: 200px;
}

.column-nameDESCRIPCION {
    width: 10px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    max-width: 100px;
}

.column-nameMONTO {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
    max-width: 150px;
}

.column-nameFECHAEMISION {
    width: 10px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    padding-right: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    max-width: 150px;
}

.column-nameFECHAVENCIMIENTO {
    width: 10px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
}

.column-nameESTADO {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
}

.column-nameTRAMITEID {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}

.column-nameRUTADMINISTRADOR {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}

.column-nameRUTUSUARIO {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-right: 70px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}
</style>