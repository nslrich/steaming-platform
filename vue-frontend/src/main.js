// NPM Imports
import { createApp } from 'vue';

// Router
import router from './router';

// Components
import App from './App.vue';

// Global Styling
import './styling/index.css';

// Setup App
const app = createApp(App);
app.use(router);
app.mount('#app');
