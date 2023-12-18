<template>
    <v-app>
        <v-container>
            <v-data-table :items="items" :headers="headers"></v-data-table>
        </v-container>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    name: 'Bitch Number 1',
                    species: 'First Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
                {
                    name: 'Bitch Number 2',
                    species: 'Second Bitch',
                    diet: 'pussy',
                    habitat: 'Mall Chino'
                },
            ],
            headers: [
                { text: 'Name', value: 'name' },
                { text: 'Species', value: 'species' },
                { text: 'Diet', value: 'diet' },
                { text: 'Habitat', value: 'habitat' },
            ],
        };
    },
};
</script>