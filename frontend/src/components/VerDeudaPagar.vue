<template>
    <v-card
      :title="deudaResults[0]?.descripcion || 'Card title'"
      :subtitle="deudaResults[0]?.fechaVencimiento ? `Fecha Vencimiento: ${deudaResults[0].fechaVencimiento}` : 'Subtitle'"
      :text="getDeudaInfo()"
      variant="tonal"
      class="Card"
    >
      <v-text-field label="Monto a pagar" v-model="MontoPagar" class="color-tertiary"></v-text-field>
      <v-card-actions>
        <v-btn @click="pagarDeuda" class="BotonPagar">Pagar</v-btn>
      </v-card-actions>
  
      <!-- Agrega el v-dialog para la confirmación -->
      <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Pago Exitoso</v-card-title>
      <v-card-text>
        <!-- Muestra el monto pagado, la descripción de la deuda y la fecha actual -->
        <div>Monto Pagado: {{ MontoPagar }}</div>
        <div>Descripción de Deuda: {{ deudaResults[0]?.descripcion }}</div>
        <div>Fecha Actual: {{ getCurrentDate() }}</div>
      </v-card-text>
      <v-card-actions>
        <!-- Modifica el botón "Aceptar" para redirigir a 'detalledeuda' -->
        <v-btn color="primary" @click="redirectToHome">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    async pagarDeuda() {
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

        // Verifica que el MontoPagar no esté vacío
        if (!this.MontoPagar) {
          console.error('Ingrese un monto válido.');
          return;
        }

        // Realiza la solicitud de pago
        const response = await fetchBase(`/deudas/${deudaID}/pagarDeuda`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PagarCantidad: this.MontoPagar,
          }),
        });

        console.log('Respuesta completa del servidor:', response);
        this.confirmDialog = true;
        // Actualiza la información de la deuda después del pago
        await this.buscarDeuda();
      } catch (error) {
        console.error('Error en la solicitud de pago:', error);
      }
    },
    
    getDeudaInfo() {
      // Construye y devuelve la información de la deuda para el texto de v-card
        const texto = "Monto: "+this.deudaResults[0].monto;
      return texto;
    },
    redirectToHome() {
      this.$router.push('deudasUsuario');
    },
    getCurrentDate() {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      return formattedDate;
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
background-color: #F3F3FB;
color: #A0C519;
}
</style>