<template>
    <v-container>
      <!-- Utiliza v-btn-toggle para seleccionar la opción -->
      <v-btn-toggle v-model="selectedOption" class="color-primary">
        <v-btn value="Todas las deudas" class="color-secondary">Todos los tramites</v-btn>
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
          <v-col class="column-nameID" :class="{'margin-top-10': showTopMargin}">
            ID
          </v-col>
          <v-col class="column-nameDESCRIPCION" :class="{'margin-top-20': showTopMargin}">
            ID tramite
          </v-col>
          <v-col class="column-nameMONTO" :class="{'margin-top-30': showTopMargin}">
            Monto fijo
          </v-col>
          <v-col class="column-nameESTADO" :class="{'margin-top-30': showTopMargin}">
            Nombre tramite
          </v-col>
          <v-col class="column-nameTRAMITEID" :class="{'margin-top-30': showTopMargin}">
            Descripcion
          </v-col>
          <v-col class="column-nameRUTADMINISTRADOR" :class="{'margin-top-30': showTopMargin}">
            Rut admin
          </v-col>
          <!-- Agrega más columnas según sea necesario -->
        </v-row>
  
  
      <v-data-table :headers="headers" :items="beneficioResults" class="color-quaternary">
        <template v-slot:items="{ item }">
          <!-- Contenido de las filas de la tabla -->
          <td class="cell">{{ item._id }}</td>
          <td class="cell">{{ item.tramiteID }}</td>
          <td class="cell">{{ item.montoFijo }}</td>
          <td class="cell">{{ item.nombreTramite }}</td>
          <td class="cell">{{ item.descripcionTramite }}</td>
          <td class="cell">{{ item.RUTAdmin }}</td>
          <!-- Agrega más columnas según sea necesario -->
        </template>
  
        <template v-slot:header="{ props }">
          <!-- Cabecera de la tabla -->
          <thead class="color-primary">
            <tr>
              <th v-for="header in props.headers" :key="header.text" class="color-secondary cell">{{ header.text }}</th>
            </tr>
          </thead>
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
        beneficioResults: [],
        selectedOption: 'Todas las deudas', // Inicializa la opción seleccionada
        rut: '',
        idDeuda: '',
        headers: [
          { text: 'ID', value: '_id' },
          { text: 'ID tramite', value: 'tramiteID' },
          { text: 'Monto fijo', value: 'montoFijo' },
          { text: 'Nombre tramite', value: 'nombreTramite' },
          { text: 'Descripcion', value: 'descripcionTramite' },
          { text: 'Rut admin', value: 'RUTAdmin' },
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

        response = await fetchBase('/tramite', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
      console.log('Respuesta completa del servidor:', response);
      this.beneficioResults = Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
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
    border: 1px solid #F3F3FB; /* Ajusta el color del borde según sea necesario */
  }
  .column-nameID {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 20px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  }
  .column-nameDESCRIPCION {
    width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 90px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
  }
  .column-nameMONTO {
    width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
  }
  .column-nameESTADO {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
  }
  .column-nameTRAMITEID {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    padding-right: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  }
  .column-nameRUTADMINISTRADOR {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
  }

  
  
  </style>