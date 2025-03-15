import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },   // With transformAssetUrls enabled, Vite automatically rewrites asset paths inside Quasar components.
    }),
    vueDevTools(),

    quasar(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server : {
   port: 8089,
   proxy: {
    '/api': {
      target: 'http://localhost:5060', // Backend server
      changeOrigin: true,
      secure: false,
    },
  },
  },
  extras: [
    'material-icons',  // ✅ Ensure Material Icons are enabled
    'fontawesome-v5'   // (Optional) Add FontAwesome if needed
  ]
})
