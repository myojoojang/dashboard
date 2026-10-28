declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vuetify/lib/framework' {
  import Vuetify from 'vuetify';
  export default Vuetify;
}

// Vuetify 2 declares barrel exports only; direct component imports use the same Vue constructor type.
declare module 'vuetify/lib/components/*' {
  import type { VueConstructor } from 'vue';
  const component: VueConstructor;

  export default component;
}

declare module 'vuetify/lib/components/VCard' {
  export { VCard, VCardText } from 'vuetify/lib/components';
}
