// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import SnackBar from './layouts/global/SnackBar.vue';
import Overlay from './layouts/global/Overlay.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)
registerPlugins(app)
app.component("snack-bar", SnackBar)
app.component("overlay", Overlay)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')