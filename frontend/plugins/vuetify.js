/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import es from 'vuetify/lib/locale/es';
import colors from 'vuetify/lib/util/colors'


// Composables
import { createVuetify } from 'vuetify'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
  },
  lang: {
    locales: { es },
    current: 'es',
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: colors.blue.darken4,
          secondary: '#5CBBF6',
        },
      },
    },
  },
  defaults: {
    VCard: {
        density:"compact",
        background: '#ECEFF1',
    },
    VTextField:{
      variant:"outlined",
      density:"compact"
    },
    VSelect:{
      variant:"outlined",
      density:"compact"
    },
    VAutocomplete:{
      variant:"outlined",
      density:"compact"
    },
    VDialog:{
      width:600,
      persistent: true,
    },
    VCombobox:{
      variant:"outlined",
      density:"compact"
    },
  }
  
})
