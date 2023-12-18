<template>
    <v-card
      :title="deudaResults[0]?.descripcion || 'Card title'"
      :subtitle="deudaResults[0]?.fechaVencimiento ? `Fecha Vencimiento: ${deudaResults[0].fechaVencimiento}` : 'Subtitle'"
      :text="getDeudaInfo()"
      variant="tonal"
      class="Card"
    ><v-text-field label="Monto a pagar" v-model="MontoPagar" class="color-tertiary"></v-text-field>
      <v-card-actions>
        <v-btn class="BotonPagar">Pagar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
import fetchBase from '@/services/fetch';

export default {
  data() {
    return {
      deudaResults: [],
    };
  },
  methods: {
    async buscarDeuda() {
      try {
        const token = localStorage.getItem('token');
        const deudaID = localStorage.getItem('deudaID');

        if (!token) {
          console.error('Token no disponible. Inicia sesión primero.');
          return;
        }

        if (!deudaID) {
          console.error('ID de deuda no disponible.');
          return;
        }

        const response = await fetchBase(`/deudas/${deudaID}`, {
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
    getDeudaInfo() {
      // Construye y devuelve la información de la deuda para el texto de v-card
        const texto = "Monto: "+this.deudaResults[0].monto;
      return texto;
    },
  },
  created() {
    this.buscarDeuda();
  },
};
</script>

<style>
.Card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.87);
  display: inline-block;
  margin: 1rem;
  max-width: 344px;
  position: relative;
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
}
.BotonPagar{
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  color: rgba(233, 17, 17, 0.87);
  display: inline-block;
  margin: 1rem;
  max-width: 344px;
  position: relative;
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
}
</style>