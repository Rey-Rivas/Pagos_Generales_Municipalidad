<template>
    <div>
        <v-row no-gutters>
            <v-col cols="3" class="d-flex justify-start">
                Porfavor, selecciones una fecha
            </v-col>
            <v-col cols="8" class="text--secondary"></v-col>
        </v-row>

        <v-row justify="center" align="justify" no-gutters>
            <v-col cols="2">
                <v-text-field v-model="fecha.start" label="Fecha de inicio" type="date"></v-text-field>
            </v-col>

            <v-col cols="2">
                <v-text-field v-model="fecha.end" label="Fecha de término" type="date"></v-text-field>
            </v-col>
        </v-row>



        <v-container>
            <!-- Utiliza v-btn-toggle para seleccionar la opción -->
            <v-btn-toggle v-model="selectedOption" class="color-primary">
                <v-btn value="FiltrarDeudasFechas" class="color-secondary">Todas las deudas</v-btn>
                <v-btn @click="downloadExcel" class="color-secondary">descargar excel</v-btn>



            </v-btn-toggle>

            <v-card>
                <v-row class="manual-column-names color-secondary justify-center align-center">

                    <v-col class="column-nameDESCRIPCION" :class="{ 'margin-top-20': showTopMargin }">
                        Descripción
                    </v-col>
                    <v-col class="column-nameMONTO" :class="{ 'margin-top-30': showTopMargin }">
                        Monto
                    </v-col>
                    <v-col class="column-nameFECHAEMISION" :class="{ 'margin-top-30': showTopMargin }">
                        Fecha de Emisión
                    </v-col>
                    <v-col class="column-nameFECHAVENCIMIENTO" :class="{ 'margin-top-30': showTopMargin }">
                        Fecha de Vencimiento
                    </v-col>
                    <v-col class="column-nameESTADO" :class="{ 'margin-top-30': showTopMargin }">
                        Estado
                    </v-col>
                    <v-col class="column-nameTRAMITEID" :class="{ 'margin-top-30': showTopMargin }">
                        Trámite ID
                    </v-col>
                    <v-col class="column-nameRUTADMINISTRADOR" :class="{ 'margin-top-30': showTopMargin }">
                        RUT Admin
                    </v-col>
                    <v-col class="column-nameRUTUSUARIO" :class="{ 'margin-top-30': showTopMargin }">
                        RUT Usuario
                    </v-col>
                    <!-- Agrega más columnas según sea necesario -->
                </v-row>


                <v-data-table :headers="headers" :items="deudaResults" class="color-quaternary">
                    <template v-slot:items="{ item }">
                        <!-- Contenido de las filas de la tabla -->
                        <td class="cell">{{ item.descripcion }}</td>
                        <td class="cell">{{ item.monto }}</td>
                        <td class="cell">{{ item.fechaEmision }}</td>
                        <td class="cell">{{ item.fechaVencimiento }}</td>
                        <td class="cell">{{ item.estado }}</td>
                        <td class="cell">{{ item.tramiteID }}</td>
                        <td class="cell">{{ item.RUTAdmin }}</td>
                        <td class="cell">{{ item.RUTUsuario }}</td>
                        <!-- Agrega más columnas según sea necesario -->
                    </template>

                    <template v-slot:header="{ props }">
                        <!-- Cabecera de la tabla -->
                        <thead class="color-primary">
                            <tr>
                                <th v-for="header in props.headers" :key="header.text" class="color-secondary cell">{{
                                    header.text }}</th>
                            </tr>
                        </thead>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import fetchBase from '@/services/fetch';
import axios from 'axios';

export default {
    data() {
        return {
            deudaResults: [],
            showTopMargin: true,
            selectedOption: 'Todas las deudas', // Inicializa la opción seleccionada
            fecha: {
                start: null,
                end: null,
            },
            headers: [
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Monto', value: 'monto' },
                { text: 'Fecha de Emisión', value: 'fechaEmision' },
                { text: 'Fecha de Vencimiento', value: 'fechaVencimiento' },
                { text: 'Estado', value: 'estado' },
                { text: 'Trámite ID', value: 'tramiteID' },
                { text: 'RUT Admin', value: 'RUTAdmin' },
                { text: 'RUT Usuario', value: 'RUTUsuario' },
                // Agrega más headers según sea necesario
            ],
        };
    },

    methods: {
        async buscarDeuda() {
            try {


                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token no disponible. Inicia sesión primero.');
                    return;
                }

                let response;

                if (this.selectedOption === 'Todas las deudas') {
                    try {
                        response = await fetchBase('/deudas', {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            },
                        });
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        return;
                    }
                }

                console.log('Respuesta completa del servidorasdasdasdasdasd:', response);
                this.deudaResults = Array.isArray(response.data) ? response.data : [response.data];
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        },

        
        async downloadExcel() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token no disponible. Inicia sesión primero.');
        return;
    }

    try {
        const response = await axios({
            url: 'http://localhost:5000/api/informes/generar-excel',
            method: 'POST',
            responseType: 'blob', // Important
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            data: {
                fechaInicio: this.fecha.start,
                fechaFin: this.fecha.end,
            },
        });

        if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'InformeDeudas.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            console.error('Error al descargarExcel. Response status:', response.status);
        }
    } catch (error) {
        console.error('Error al descargarExcel:', error);
    }
}


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
    width: 10000px;
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
    padding-left: 10px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}

.column-nameDESCRIPCION {
    width: 20px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-right: 250px;
    
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}

.column-nameMONTO {
    width: 100px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 160px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
}

.column-nameFECHAEMISION {
    width: 10px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    padding-right: 50px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
}

.column-nameFECHAVENCIMIENTO {
    width: 10px;
    /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start;
    /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 90px;
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