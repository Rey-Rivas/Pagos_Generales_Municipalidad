<template>
    <v-container>

        <v-row justify="center" align="center">
            
            <v-responsive justify="center" align="center">
            
                <v-col cols="auto">
                    <v-btn color="info" density="default" class="Boton1">
                        Ver Deudas :D
                    </v-btn>
                </v-col>

                <v-col cols="auto">
                    <v-btn color="info" density="default" class="Boton2">
                        Modificar Impuestos
                    </v-btn>
                </v-col>

                <v-col cols="auto">
                    <v-btn color="info" density="default" class="Boton3">
                        Gestionar Tramites
                    </v-btn>
                </v-col>

                <v-col cols="auto">
                    <v-btn @click="Botondeprueba" color="info" density="default" class="Boton4">Opcion 4 (no se que vergas poner acá)</v-btn>
                </v-col>
            </v-responsive>
        
        </v-row>
    
    </v-container>
    
</template>
<script>
export default {
    methods: {
        Botondeprueba() {alert('Funcionas?');},
        fetchData() {
            fetch('http://localhost:3000/api/endpoint')
                .then(response => response.json())
                .then(data => {
                    // Use the data here
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }
};
</script>
<style>

</style>
