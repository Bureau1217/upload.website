<template>
  <main class="v-home">
    <!-- Hero avec animation p5 -->
    <AppHero />
    
    <template v-if="data && data.status === 'ok'">
      <!-- Ligne de séparation -->
      <div class="section-separator"></div>

      <!-- Section exposants -->
      <section v-if="exposantsData && exposantsData.status === 'ok' && exposantsData.result?.length" class="section">
        <h2 class="section-title">Exposants</h2>
        <AppExposantsList :exposants="exposantsData.result" />
      </section>

    </template>

    <template v-else-if="status === 'error'">
      <div class="error">
        Erreur de chargement du contenu
      </div>
    </template>

    <template v-else>
      <div class="loading">Chargement... [Test déploiement automatique]</div>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { HomeData, ExposantData, CMSFetchData, CMSListData } from '~/composables/cms_api'

const { data, status } = await useFetch<CMSFetchData<HomeData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: "site.find('home')",
    select: {
      title: true,
      slug: true,
      intro: true
    }
  }
})

const { data: exposantsData } = await useFetch<CMSListData<ExposantData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: "site.find('exposants').children()",
    select: {
      title: true,
      slug: true,
      content_subtitle: true,
      info_image: {
        query: 'page.info_image.toFiles',
        select: {
          url: true,
          alt: true,
          width: true,
          height: true
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
/* Styles spécifiques à la page d'accueil si nécessaire */
</style>
