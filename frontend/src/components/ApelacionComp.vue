<template>
  <v-container>
    <!-- Muestra u oculta el cuadro de texto según la opción seleccionada -->
    <v-container>
      <v-text-field label="RUT" v-model="rut" class="color-tertiary"></v-text-field>
      <v-btn @click="buscarApelacion" class="color-quinary">Buscar</v-btn>
    </v-container>
    
    <!-- Utiliza v-btn-toggle para seleccionar la opción -->
    <v-btn-toggle v-model="selectedOption" class="color-primary">
      <v-btn value="Todas las deudas" class="color-secondary">Todas las apelaciones</v-btn>
    </v-btn-toggle>
    <v-dialog width="500">
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" text="Open Dialog"> </v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Dialog">
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>

    <v-card>
      <v-row class="manual-column-names color-secondary justify-center align-center">
        <v-col class="column-nameRUTUSUARIO" :class="{'margin-top-20': showTopMargin}">
          RUT usuario
        </v-col>
        <v-col class="column-nameDESCRIPCION" :class="{'margin-top-30': showTopMargin}">
          Descripción
        </v-col>
        <v-col class="column-nameDEUDA" :class="{'margin-top-30': showTopMargin}">
          Deuda
        </v-col>
        <v-col class="column-nameESTADO" :class="{'margin-top-30': showTopMargin}">
          Estado
        </v-col>
        <v-col class="column-nameDOCUMENTO" :class="{'margin-top-30': showTopMargin}">
          Documento
        </v-col>
        <!-- Agrega más columnas según sea necesario -->
      </v-row>


    <v-data-table :headers="headers" :items="apelacionResults" class="color-quaternary">
      <template v-slot:items="{ item }">
        <!-- Contenido de las filas de la tabla -->
        <td class="cell">{{ item.RUTUsuario }}</td>
        <td class="cell">{{ item.descripcion }}</td>
        <td class="cell">{{ item.deudaID }}</td>
        <td class="cell">{{ item.estado }}</td>
        <td class="cell">{{ item.documento }}</td>
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
      apelacionResults: [],
      selectedOption: 'Todas las apelaciones', // Inicializa la opción seleccionada
      rut: '',
      idApelacion: '',
      headers: [
        { text: 'RUT Usuario', value: 'RUTUsuario' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Deuda', value: 'deudaID' },
        { text: 'Estado', value: 'estado' },
        { text: 'Documento', value: 'documento' },
        // Agrega más headers según sea necesario
      ],
    };
  },
  watch: {
    // Observa cambios en la opción seleccionada
    selectedOption() {
      // Resetea los valores de los campos cuando cambia la opción
      this.rut = '';
      this.idApelacion = '';

      // Llama a la función para cargar los datos de la apelacion
      this.buscarApelacion();
    },
  },
  methods: {
    async buscarApelacion() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no disponible. Inicia sesión primero.');
      return;
    }

    let response;

      response = await fetchBase('/apelacion', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },

      });
    console.log('Respuesta completa del servidor:', response);
    this.apelacionResults = Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
},
  },
  created() {
    // Llama a la función para cargar los datos de la apelacion cuando el componente se crea
    this.buscarApelacion();
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
.column-nameRUTUSUARIO {
  width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 90px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 0px;
}
.column-nameDESCRIPCION {
  width: 10px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 0px;
}
.column-nameDEUDA {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 0px;
}
.column-nameESTADO {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px;
  padding-right: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
}
.column-nameDOCUMENTO {
  width: 100px; /* Ajusta el ancho de las columnas según sea necesario */
  text-align: start; /* Alinea el texto al comienzo de la celda */
  padding-left: 0px; /* Ajusta el valor según sea necesario para el espaciado deseado */
  padding-right: 0px;
}



</style>