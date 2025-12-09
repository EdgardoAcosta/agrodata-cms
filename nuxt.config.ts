// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  vite: {
    server: {
      allowedHosts: ["*.ngrok-free.app"],
    },
  },
  devtools: { enabled: true },
  css: ["@mdi/font/css/materialdesignicons.css", "./app/assets/css/app.scss"],
  modules: ["vuetify-nuxt-module", "@nuxtjs/i18n"],
  i18n: {
    locales: [
      { code: "es", name: "Español", file: "es.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    defaultLocale: "es",
    strategy: "no_prefix",
  },
});
