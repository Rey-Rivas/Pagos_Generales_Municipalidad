<template>
    <v-card
      :title="deudaResults[0]?.nombreBeneficio || 'Card title'"
      :subtitle="deudaResults[0]?.RUTUsuario ? `Rut usuario: ${deudaResults[0].RUTUsuario}` : 'Subtitle'"
      variant="tonal"
      class="Card"
    >
      <v-text-field label="Nombre del beneficio" v-model="NombreBeneficio" class="color-tertiary"></v-text-field>
      <v-text-field label="Descripcion" v-model="DescripcionBeneficio" class="color-tertiary"></v-text-field>
      <v-text-field label="Monto" v-model="MontoBeneficio" class="color-tertiary"></v-text-field>
      <v-select label="Estado" v-model="EstadoBeneficio" :items="['aprobado', 'rechazado','pendiente']" class="color-tertiary"></v-select>
      <v-text-field label="ID deuda" v-model="IdDeudaBeneficio" class="color-tertiary"></v-text-field>
      <v-card-actions>
        <v-btn @click="pagarDeuda" class="BotonPagar">Editar</v-btn>
      </v-card-actions>
  
      <!-- Agrega el v-dialog para la confirmación -->
      <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Beneficio editado exitosamente</v-card-title>
      <v-card-text>
        <!-- Muestra el monto pagado, la descripción de la deuda y la fecha actual -->
        <div>Monto Pagado</div>
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
      NombreBeneficio: '',
      DescripcionBeneficio: '',
      MontoBeneficio: '',
      EstadoBeneficio: '',
      IdDeudaBeneficio: '',
        confirmDialog: false,
    };
  },
  watch: {
    deudaResults: {
      immediate: true,
      handler(newValue) {
        if (newValue[0]) {
          this.NombreBeneficio = newValue[0].nombreBeneficio || '';
          this.DescripcionBeneficio = newValue[0].descripcion || '';
          this.MontoBeneficio = newValue[0].monto || '';
          this.EstadoBeneficio = newValue[0].estado || '';
          this.IdDeudaBeneficio = newValue[0]._id || '';
        }
      },
    },
  },
  methods: {
    async buscarDeuda() {
      try {
        const token = localStorage.getItem('token');
        const beneficioID = localStorage.getItem('beneficioID');

        if (!token) {
          console.error('Token no disponible. Inicia sesión primero.');
          return;
        }

        if (!beneficioID) {
          console.error('ID de beneficio no disponible.');
          return;
        }

        const response = await fetchBase(`/beneficios/${beneficioID}`, {
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
        const beneficioID = localStorage.getItem('beneficioID');
        const idDeuda = localStorage.getItem('idDeuda');
        if (!token) {
          console.error('Token no disponible. Inicia sesión primero.');
          return;
        }
        // Realiza la solicitud de pago
        const response = await fetchBase(`/beneficios/estado/${beneficioID}`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombreBeneficio: this.NombreBeneficio,
            descripcion: this.DescripcionBeneficio,
            monto: this.MontoBeneficio,
            estado: this.EstadoBeneficio,
            idDeuda: idDeuda,
          }),
        });

        console.log('Respuesta completa del servidor:', response);
        this.confirmDialog = true;
        // Actualiza la información de la deuda después del pago
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
      this.$router.push('beneficios');
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
    
    if (this.deudaResults[0]) {
      this.NombreBeneficio = this.deudaResults[0].nombreBeneficio || 'a';
      this.DescripcionBeneficio = this.deudaResults[0].descripcion || 'b';
      this.MontoBeneficio = this.deudaResults[0].monto || 'c';
      this.EstadoBeneficio = this.deudaResults[0].estado || 'd';
      this.IdDeudaBeneficio = this.deudaResults[0].idDeuda || 'e';
    }
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