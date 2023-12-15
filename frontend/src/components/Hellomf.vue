<template>
  <div class="card">
    <button type="button" @click="fetchUsers">Fetch Users</button>
    <v-data-table :headers="headers" :items="users" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      headers: [
        { text: 'RUT', value: 'RUT' },
        { text: 'Name', value: 'username' },
        { text: 'Email', value: 'email' },
      ],
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGVzIjpbeyJfaWQiOiI2NTNmMDY4YjRhNThhNDg1NzgyMWU1MzUiLCJuYW1lIjoiYWRtaW4ifV0sImlhdCI6MTcwMjU4MjY4NiwiZXhwIjoxNzAyNjY5MDg2fQ.KuGrprQ5pyUKTnVeVr9xa_BHZvYF4NLjYGdDNCQHGZs',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        this.users = data.data
        console.log(this.users[0]);
        console.log(this.users[0].RUT); 
      } catch (error) {
        console.log(error);
      }
    },
    
    editItem(item) {
      // Implement your logic to edit a user
    },
    deleteItem(item) {
      // Implement your logic to delete a user
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>