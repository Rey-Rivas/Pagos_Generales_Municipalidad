<template>
    <v-container>
      <!-- Utiliza v-btn-toggle para seleccionar la opción -->
      <v-btn-toggle v-model="selectedOption" class="color-primary">
        <v-btn value="Todas las deudas" class="color-secondary">Todos los beneficios</v-btn>
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
            Nombre beneficio
          </v-col>
          <v-col class="column-nameMONTO" :class="{'margin-top-30': showTopMargin}">
            Descripcion
          </v-col>
          <v-col class="column-nameESTADO" :class="{'margin-top-30': showTopMargin}">
            Monto
          </v-col>
          <v-col class="column-nameTRAMITEID" :class="{'margin-top-30': showTopMargin}">
            Estado
          </v-col>
          <v-col class="column-nameRUTADMINISTRADOR" :class="{'margin-top-30': showTopMargin}">
            ID deuda
          </v-col>
          <v-col class="column-nameRUTUSUARIO" :class="{'margin-top-30': showTopMargin}">
            RUT Usuario
          </v-col>
          <!-- Agrega más columnas según sea necesario -->
        </v-row>
  
  
        <v-data-table :headers="headers" :items="beneficioResults" class="color-quaternary">
  <template v-slot:item._id="{ item }">{{ item._id }}</template>
  <template v-slot:item.nombreBeneficio="{ item }">{{ item.nombreBeneficio }}</template>
  <template v-slot:item.descripcion="{ item }">{{ item.descripcion }}</template>
  <template v-slot:item.monto="{ item }">{{ item.monto }}</template>
  <template v-slot:item.estado="{ item }">{{ item.estado }}</template>
  <template v-slot:item.idDeuda="{ item }">{{ item._id }}</template>
  <template v-slot:item.RUTUsuario="{ item }">{{ item.RUTUsuario }}</template>
  <template v-slot:item.acciones="{ item }">
    <v-btn color="primary" @click="editarBeneficio(item)">Editar</v-btn>
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
          { text: 'Nombre beneficio', value: 'nombreBeneficio' },
          { text: 'Descripcion', value: 'descripcion' },
          { text: 'Monto', value: 'monto' },
          { text: 'Estado', value: 'estado' },
          { text: 'ID deuda', value: 'idDeuda' },
          { text: 'Rut del usuario', value: 'RUTUsuario' },
          { text: 'Acciones', value: 'acciones' },
          // Agrega más headers según sea necesario
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
      if (!token) {
        console.error('Token no disponible. Inicia sesión primero.');
        return;
      }
  
      let response;

        response = await fetchBase('/beneficios', {
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
  editarBeneficio(item) {
    console.log('Beneficio seleccionado:', item);
    localStorage.setItem('beneficioID', item._id);
    localStorage.setItem('deudaID', item.idDeuda);
      console.log('ID del beneficio:', item._id);
      this.$router.push('beneficioeditar');
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
    padding-left: 120px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  }
  .column-nameMONTO {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 60px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
    max-width: 185px;
  }
  .column-nameESTADO {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 90px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 0px;
  }
  .column-nameTRAMITEID {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px;
    padding-right: 100px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  }
  .column-nameRUTADMINISTRADOR {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
    padding-right: 100px;
  }
  .column-nameRUTUSUARIO {
    width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
    text-align: start; /* Alinea el texto al comienzo de la celda */
    padding-right: 20px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  }
  
  
  </style>