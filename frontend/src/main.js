// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

 // Plugins
import { registerPlugins } from '@/plugins'

import SnackBar from './layouts/global/SnackBar.vue';
import Overlay from './layouts/global/Overlay.vue';


const app = createApp(App)
registerPlugins(app)
app.component("snack-bar", SnackBar)
app.component("overlay", Overlay)

app.mount('#app')
