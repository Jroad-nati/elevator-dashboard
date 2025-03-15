import './assets/main.css'
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from "quasar";
import "quasar/src/css/index.sass";
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Quasar, {
    plugins: {}, // Add plugins if needed
  });
app.use(createPinia())
app.use(router)

app.mount('#app')
