<template>
    <div class="login">
        <v-form fast-fail @submit.prevent="login" class="form" ref="formLogin">
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="12" justify="center">
                    <h1 ref="LogText" class="text-center">Inicia Sesión</h1>
                    <p ref="welcomeText" class="text-center">Hola! Nos alegra tenerte por aqui.</p>
                </v-col>
                <v-col cols="12" class="my-col">
                    <v-text-field v-model="email" label="E-mail"
                        clearable :append-inner-icon="'mdi-email'" counter required></v-text-field>
                </v-col>
                <v-col cols="12" class="my-col">
                    <v-text-field v-model="password" :append-inner-icon="passVisible ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="passVisible ? 'text' : 'password'" label="Contraseña" counter
                        clearable @click:append-inner="passVisible = !passVisible" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-divider class="my-divider"></v-divider>
                </v-col>
                </v-row>
                <input class="form-submit" type="submit" value="INGRESAR" />
        </v-form>
    </div>
</template>

<script>
import fetchBase from '@/services/fetch';

export default {
    data() {
        return {
            passVisible: false,

            email: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try {
                const data = await fetchBase('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password,
                    }),
                });

                // Store the token in local storage
                localStorage.setItem('token', data.data.accessToken);
                console.log('Login successful!');
                console.log('Token:', data.data.accessToken);

                // Fetch the role of the user
                const roleData = await fetchBase(`/users/checkRoles/${this.email}`, {
                    headers: {
                        'Authorization': 'Bearer ' + data.data.accessToken,
                    },
                });
                localStorage.setItem('role', roleData.data.role);
                console.log('Role:', roleData.data.role);

                // Redirect to the home page
                this.$router.push('/api');
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Afacad&display=swap');

body {
    font-family: 'Istok Web', sans-serif;
}

.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.form {
    margin: 3rem auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 34%;
    min-width: 500px;
    max-width: 40%;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    padding: 30px;
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.3);
}

.form-submit {
    background: #1976D2;
    border: none;
    color: white;
    margin-top: 0rem;
    padding: 0.6rem 0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 3px;
    width: 70%;
    margin-left: 15%;

    &:hover {
        background: #3BA3E3;
    }
}

.my-col {
    margin-bottom: -0.5em;
}

.my-divider {
    width: 100%;  /* Adjust this value as needed */
    margin-bottom: 2em;  /* Center the divider */
}
</style>