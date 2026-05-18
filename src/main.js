import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Irukurura index.js mu buryo bwikora

const app = createApp(App);

app.use(store);
app.mount('#app');
