<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label>
                E-mail:
                <input v-model="email" type="text" required />
            </label>
            <label>
                Password:
                <input v-model="password" type="password" required />
            </label>
            <button type="submit">Login</button>
        </form>
    </div>  
</template>

<script>
import fetchBase from '@/services/fetch';

export default {
    data() {
        return {
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

                // Redirect to the home page
                this.$router.push('/api');
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    },
};
</script>