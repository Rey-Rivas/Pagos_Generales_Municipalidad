<template>
    <v-col cols="12" md="10">
        <h1 class="title">Eliminar Deudas</h1>
    </v-col>
    <v-col cols="12" md="10">
        <v-text class="subtitle">Selecciona las deudas que quieras eliminar.</v-text>
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
        <v-btn color="#A0C519" @click="eliminarDeudas" :disabled="selectedItems.length === 0">Eliminar Deuda</v-btn>
    </v-col>
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

                this.deudaList = deudaList.data.map(({__v, ...rest }) => rest);
                console.log('Deudas:', this.deudaList);

            } catch (error) {
                console.log('Error al obtener los tramites:', error);
            }
        },

        async eliminarDeudas() {

            var deudasEliminadas = 0;
            var unicaDeuda = '';

            console.log('Deudas a eliminar:');
            console.log(this.selectedItems);

            if (this.selectedItems.length === 1) {
                unicaDeuda = this.selectedItems[0];
            }

            for (const item of this.selectedItems) {
                console.log('Eliminando deuda: '+item);
                try {
                    const response = await fetchBase(`/deudas/`+item, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        },
                    });

                    console.log('Respuesta: ');
                    console.log(response);
                    deudasEliminadas++;

                } catch (error) {
                    console.log('Error al eliminar deuda:', error);
                }
            
            }

            this.selectedItems = [];
            if (deudasEliminadas === 0) {
                this.$root.showSnackBar('error', 'Error', 'No se eliminaron deudas.');
                return;
            } else if (deudasEliminadas === 1) {
                this.$root.showSnackBar('success', 'Success', 'Deuda '+unicaDeuda+' eliminada!');
            } else {
                this.$root.showSnackBar('success', 'Success', deudasEliminadas + ' Deuda(s) eliminada(s) exitosamente!');
            }

            this.getDeudas();
        },
      },
        mounted() {
            this.getDeudas();
        },
    }
  </script>