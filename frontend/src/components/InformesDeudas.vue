<template>
    <div>
        <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
                Start and end dates
            </v-col>
            <v-col cols="8" class="text--secondary">
                <v-row no-gutters style="width: 100%">
                    <v-col cols="6" class="d-flex justify-start">
                        Start date: {{ trip.start || 'Not set' }}
                    </v-col>
                    <v-col cols="6" class="d-flex justify-start">
                        End date: {{ trip.end || 'Not set' }}
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row justify="space-around" no-gutters>
            <v-col cols="3">
                <v-text-field
                    v-model="trip.start"
                    label="Start date"
                    type="date"
                ></v-text-field>
            </v-col>

            <v-col cols="3">
                <v-text-field
                    v-model="trip.end"
                    label="End date"
                    type="date"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-card
    flat
    title="Nutrition"
  >
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        hide-details
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    ></v-data-table>
  </v-card>



    </div>
</template>
<script>
    export default {

        data: () => ({
            trip: {
                name: '',
                location: null,
                start: null,
                end: null,
            },
            deudaResults: [], // Add deudaResults property to store the data for the table
        }),

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
                } 

                console.log('Respuesta completa del servidor:', response);
                this.deudaResults = response.data; // Assign the response data to deudaResults
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
