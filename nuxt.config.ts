// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true
    },
    inlineDynamicImports: true
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets/',
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/Favicon_Upload.png' }
      ]
    }
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