// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true
    },
    inlineDynamicImports: true
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets/'
  },
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: () => 'everything.js'
        }
      }
    }
  },
  devServer: { port: 3001 },
  css: [
    '~/assets/_main.scss'
  ]
})