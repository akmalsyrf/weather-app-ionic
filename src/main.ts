import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/ionic.bundle.css';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue);
app.mount('#app');

