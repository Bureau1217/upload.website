// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  runtimeConfig: {
    public: {
      kirbyUrl: process.env.KIRBY_URL || 'https://cms.upload-biennale.ch'
    }
  },
  image: {
    // Configuration pour des images plus légères
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    // Améliorer le cache et le lazy loading
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 80
        }
      }
    }
  },
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