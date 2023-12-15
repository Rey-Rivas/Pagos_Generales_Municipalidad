<template>
    <div id="app">
        <h1>My Simple App</h1>
        <button @click="sayHello">Click me</button>
    </div>
</template>

<script>
export default {
    methods: {
        sayHello() {
            alert('Hello');
        },
    },
};
</script>

<style scoped>
h1 {
    font-size: 2em;
    text-align: center;
    color: #bada55;
}

button {
    font-size: 2em;
    background-color: #ff6347;
    color: white;
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
}
</style>