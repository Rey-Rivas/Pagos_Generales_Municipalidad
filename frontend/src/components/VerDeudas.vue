<template>
  <v-container>
    <!-- Utiliza v-btn-toggle para seleccionar la opción -->
    <v-btn-toggle v-model="selectedOption" class="color-primary">
      <v-btn value="Todas las deudas" class="color-secondary">Todas las deudas</v-btn>
      <v-btn value="Deuda especifica" class="color-secondary">Deuda especifica</v-btn>
      <v-btn value="Deuda usuario" class="color-secondary">Deuda usuario</v-btn>
    </v-btn-toggle>

    <!-- Muestra u oculta el cuadro de texto según la opción seleccionada -->
    <v-container v-if="selectedOption === 'Deuda especifica'">
      <v-text-field label="RUT" v-model="rut" class="color-tertiary"></v-text-field>
    </v-container>

    <!-- Muestra u oculta el cuadro de texto según la opción seleccionada -->
    <v-container v-if="selectedOption === 'Deuda usuario'">
      <v-text-field label="Id deuda" v-model="idDeuda" class="color-tertiary"></v-text-field>
    </v-container>

    <v-data-table :headers="headers" :items="deudaResults" class="color-quaternary">
      <template v-slot:items="{ item }">
        <!-- Contenido de las filas de la tabla -->
        <td>{{ item._id }}</td>
        <td>{{ item.descripcion }}</td>
        <td>{{ item.monto }}</td>
        <td>{{ item.fechaEmision }}</td>
        <td>{{ item.fechaVencimiento }}</td>
        <td>{{ item.estado }}</td>
        <td>{{ item.tramiteID }}</td>
        <td>{{ item.RUTAdmin }}</td>
        <td>{{ item.RUTUsuario }}</td>
        <td>{{ item.__v }}</td>
        <td>{{ item.fechaPago }}</td>
        <!-- Agrega más columnas según sea necesario -->
      </template>

      <template v-slot:header="{ props }">
        <!-- Cabecera de la tabla -->
        <thead class="color-primary">
          <tr>
            <th v-for="header in props.headers" :key="header.text" class="color-secondary">{{ header.text }}</th>
          </tr>
        </thead>
      </template>
    </v-data-table>

    <v-btn @click="redirigir" class="color-quinary">Pagar Deuda</v-btn>
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
        { text: 'ID', value: '_id' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Monto', value: 'monto' },
        { text: 'Fecha de Emisión', value: 'fechaEmision' },
        { text: 'Fecha de Vencimiento', value: 'fechaVencimiento' },
        { text: 'Estado', value: 'estado' },
        { text: 'Trámite ID', value: 'tramiteID' },
        { text: 'RUT Admin', value: 'RUTAdmin' },
        { text: 'RUT Usuario', value: 'RUTUsuario' },
        { text: '__v', value: '__v' },
        { text: 'Fecha de Pago', value: 'fechaPago' },
        // Agrega más headers según sea necesario
      ],
    };
  },
  watch: {
    // Observa cambios en la opción seleccionada
    selectedOption(newOption) {
      // Resetea los valores de los campos cuando cambia la opción
      this.rut = '';
      this.idDeuda = '';

      // Llama a la función para cargar los datos de la deuda
      this.cargarDeuda();
    },
  },
  methods: {
    async cargarDeuda() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no disponible. Inicia sesión primero.');
          return;
        }

        let response;
        if (this.selectedOption === 'Todas las deudas') {
          response = await fetchBase('/deudas/usuario/20487563-4', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
            },
          });
        } else if (this.selectedOption === 'Deuda especifica') {
          // Lógica para cargar datos según 'Deuda especifica'
          // Reemplaza '/ruta/especifica' con la ruta correcta
          response = await fetchBase('/ruta/especifica', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
            },
            // Puedes incluir más parámetros según sea necesario
          });
        } else if (this.selectedOption === 'Deuda usuario') {
          // Lógica para cargar datos según 'Deuda usuario'
          // Reemplaza '/ruta/usuario' con la ruta correcta
          response = await fetchBase('/ruta/usuario', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
            },
            // Puedes incluir más parámetros según sea necesario
          });
        }

        console.log('Respuesta completa del servidor:', response);
        this.deudaResults = response.data;
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },
    redirigir() {
      // Agrega la lógica de redirección aquí
      console.log('Redirigiendo a otra ruta');
    },
  },
  created() {
    // Llama a la función para cargar los datos de la deuda cuando el componente se crea
    this.cargarDeuda();
  },
};
</script>

<style scoped>
.color-primary {
  background: linear-gradient(to right, #5A2EA8, #F96943);
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
  background: #F3F3FB;
  color: #000000;
}

.color-quinary {
  background-color: #F3F3FB;
  color: #5A2EA8;
}

/* Agrega un estilo para las celdas de la tabla */
.color-quaternary td {
  border: 1px solid #F3F3FB; /* Ajusta el color del borde según sea necesario */
}
</style>