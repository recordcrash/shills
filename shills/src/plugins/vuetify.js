import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  options: {
    customProperties: true,
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#EE7C40',
        secondary: '#2D1324',
        accent: '#EE7C40',
        error: '#801313',
      },
    },
  },
});
