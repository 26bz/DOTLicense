// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@prisma/nuxt',
    'nuxt-authorization',
    '@pinia/nuxt',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
});