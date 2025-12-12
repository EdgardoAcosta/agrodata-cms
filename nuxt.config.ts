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
  modules: ["@sidebase/nuxt-auth", "vuetify-nuxt-module", "@nuxtjs/i18n"],
  i18n: {
    locales: [
      { code: "es", name: "Español", file: "es.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    defaultLocale: "es",
    strategy: "no_prefix",
  },
  auth: {
    baseURL: "/api/auth",
    origin: process.env.NUXT_AUTH_URL || "http://localhost:3000",
    provider: {
      type: "authjs",
      trustHost: true,
      defaultProvider: "credentials",
      addDefaultCallbackUrl: true,
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
  routeRules: {
    "/": { redirect: "/warehouse" },
  },
  runtimeConfig: {
    // Private runtime config (server-side only)
    // Environment variables with NUXT_ prefix are automatically loaded
    authJs: {
      // This will read from NUXT_AUTH_JS_SECRET env var
      secret: "",
      // Temporary mock credentials until real backend auth is connected
      mockUserEmail: "",
      mockUserPassword: "",
    },
    // External API configuration (server-side ONLY - not exposed to client)
    apiBaseUrl: process.env.NUXT_API_BASE_URL || "http://localhost:8883",
  },
});
