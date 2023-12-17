<template>
  <v-data-table
    :headers="headers"
    :items="apelaciones"
    :search="search"
    :loading="loading"
    :rows-per-page-items="[10, 20, 30]"
    :pagination.sync="pagination"
    :total-items="totalItems"
    @update:pagination="getApelaciones"
  >
    <template v-slot:item.actions="{ item }">
      <!-- Add any actions you want to perform on each apelacion here -->
      <v-btn color="primary" @click="evaluarApelacion(item)">Evaluar Apelacion</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      headers: [
        // Define the headers for your table
        { text: 'RUT Usuario', value: 'RUTUsuario' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Deuda', value: 'deudaID' },
        { text: 'Estado', value: 'estado' },
        { text: 'Documento', value: 'documento' },
        // Add more headers as needed
      ],
      apelaciones: [],
      search: '',
      loading: false,
      pagination: {
        sortBy: '_id',
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
    };
  },
  mounted() {
    this.getApelaciones();
  },
  methods: {
    async getApelaciones() {
      try {
        this.loading = true;
        const response = await axios.get('/apelacion');
        this.apelaciones = response.data;
        this.totalItems = this.apelaciones.length;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    evaluarApelacion(item) {
      // Implement the logic to evaluate the apelacion
    },
  },
};
</script>
