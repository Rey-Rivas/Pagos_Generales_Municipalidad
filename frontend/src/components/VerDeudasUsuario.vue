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
        <v-col class="column-nameDESCRIPCION" :class="{'margin-top-20': showTopMargin}">
          Descripción
        </v-col>
        <v-col class="column-nameMONTO" :class="{'margin-top-30': showTopMargin}">
          Monto
        </v-col>
        <v-col class="column-nameFECHAEMISION" :class="{'margin-top-30': showTopMargin}">
          Fecha de Emisión
        </v-col>
        <v-col class="column-nameFECHAVENCIMIENTO" :class="{'margin-top-30': showTopMargin}">
          Fecha de Vencimiento
        </v-col>
        <v-col class="column-nameESTADO" :class="{'margin-top-30': showTopMargin}">
          Estado
        </v-col>
        <v-col class="column-nameTRAMITEID" :class="{'margin-top-30': showTopMargin}">
          Trámite ID
        </v-col>
        <v-col class="column-nameRUTADMINISTRADOR" :class="{'margin-top-30': showTopMargin}">
          RUT Admin
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
    <v-btn color="primary" @click="pagarDeuda(item)">Pagar</v-btn>
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
      deudaResults: [],
      selectedOption: 'Todas las deudas', // Inicializa la opción seleccionada
      rut: '',
      idDeuda: '',
      headers: [
{ text: 'Descripción', value: 'descripcion' },
{ text: 'Monto', value: 'monto' },
{ text: 'Fecha de Emisión', value: 'fechaEmision' },
{ text: 'Fecha de Vencimiento', value: 'fechaVencimiento' },
{ text: 'Estado', value: 'estado' },
{ text: 'Trámite ID', value: 'tramiteID' },
{ text: 'RUT Admin', value: 'RUTAdmin' },
{ text: 'Acciones', value: 'acciones' },
],
    };
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

    pagarDeuda(item) {
      // Guarda el ID de la deuda en el almacenamiento local
      localStorage.setItem('deudaID', item._id);
      console.log('ID de la deuda:', item._id);
      this.$router.push('detalledeuda');
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
  width: 2000px;
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
  border: 1px solid #F3F3FB; /* Ajusta el color del borde según sea necesario */
}

.column-nameDESCRIPCION {
  width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 20px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  max-width: 120px;
}
.column-nameMONTO {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 280px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 190px;
  max-width: 540px;
}
.column-nameFECHAEMISION {
  width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px;
  max-width: 150px;
  padding-right: 50px; /* Ajusta el valor según sea necesario para el espaciado deseado */
}
.column-nameFECHAVENCIMIENTO {
  width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 50px;
  max-width: 150px;
}
.column-nameESTADO {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 60px;
  max-width: 118px;
}
.column-nameTRAMITEID {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  max-width: 100px;
}

</style>