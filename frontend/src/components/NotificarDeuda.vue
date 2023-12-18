<template>
    <v-container>
    <v-col cols="12" md="10">
        <h1 class="title">Enviar Notificaciones</h1>
    </v-col>
    <v-col cols="12" md="10">
        <text class="subtitle">Selecciona las deudas a las que quieras notificar.</text>
    </v-col>

    <v-col cols="12" md="12">
        <v-data-table
            v-model="selectedItems"
            :items="deudaList"
            item-value="_id"
            show-select
            class="centered-table"
        ></v-data-table>
    </v-col>

    <v-col cols="12" md="12">
        <v-btn color="#A0C519" @click="enviarMail" :disabled="selectedItems.length === 0">Enviar Notificacion</v-btn>
    </v-col>
    </v-container>
</template>

<script>
import fetchBase from '@/services/fetch';

export default {
    data () {
        return {
            valid: true,
            token: localStorage.getItem('token'),
            user_RUT: localStorage.getItem('user_RUT'),

            deudaList: [],
            deudaMailList: [],
            selectedItems: [],
        }
    },
    methods: {
        async getDeudas() {
            try {
                const deudaList = await fetchBase(`/deudas`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                    },
                });

                this.deudaList = deudaList.data.filter(deuda => deuda.estado !== 'pagado')
                    .map(({__v, ...rest }) => rest);
                console.log('Deudas:', this.deudaList);

            } catch (error) {
                console.log('Error al obtener los tramites:', error);
            }
        },
        async enviarMail() {
            const deudaMailList = this.selectedItems.map(item => {
                const matchingDeuda = this.deudaList.find(deuda => deuda._id === item);
                return {
                    _id: item,
                    RUTUsuario: matchingDeuda ? matchingDeuda.RUTUsuario : null,
                };
            });
            var mailsEnviados = 0;
            // Loop through deudaMailList and send requests
            for (const item of deudaMailList) {
                try {
                    const requestBody = {
                        deudaID: item._id,
                        RUTUsuario: item.RUTUsuario,
                        RUTEncargado: this.user_RUT,
                    };

                    console.log('Sending request with body:', requestBody);

                    const response = await fetchBase(`/notificaciones`, {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                        body: JSON.stringify(requestBody),
                    });

                    console.log(response);
                    mailsEnviados++;
                } catch (error) {
                    console.log('Error al enviar mail:', error);
                }
            
            }
            this.selectedItems = [];
            if (mailsEnviados === 0) {
                this.$root.showSnackBar('error', 'Error', 'No se enviaron mails.');
                return;
            } else {
                this.$root.showSnackBar('success', 'Success', mailsEnviados + ' Mail(s) enviado(s) exitosamente!');
            }
        },
        pulsarBoton() {
            console.log('Boton pulsado');
            console.log('Deudas seleccionadas:', this.selectedItems);
        },
      },
        mounted() {
            this.getDeudas();
        },
    }
  </script>