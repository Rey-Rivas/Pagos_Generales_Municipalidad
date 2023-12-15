// Import global styles, main component, and plugins
import './style.css'
import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '../plugins'
import moment from 'moment';
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// Import plugins
import SnackBar from './layouts/global/SnackBar.vue';
import Overlay from './layouts/global/Overlay.vue';

// Create the app
const app = createApp(App)
const vuetify = createVuetify({
    icons: {
      iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  })

registerPlugins(app)

app.config.globalProperties.$moment = moment;
moment.locale('es-cl');
app.component("snack-bar", SnackBar)
app.component("overlay", Overlay)

// Mount the app
app.mount('#app')