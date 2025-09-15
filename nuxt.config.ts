// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'node-server',
    inlineDynamicImports: true
  },
  app: {
    baseURL: '/',
    buildAssetsDir: '_nuxt/',
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/Favicon_Upload.png' }
      ]
    }
  },
  experimental: {
    payloadExtraction: false
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
  devServer: { port: 3000 },
  css: [
    '~/assets/_main.scss'
  ]
})