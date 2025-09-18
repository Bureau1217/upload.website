<template>
  <!-- Loader initial plein écran -->
  <AppLoadingState v-if="isInitialLoading" type="loading" />

  <!-- Contenu de la page -->
  <main v-else class="v-home">
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
      <AppLoadingState type="error" message="Erreur de chargement" />
    </template>

    <template v-else>
      <AppLoadingState type="loading" />
    </template>
  </main>
</template>

<script setup lang="ts">
import type { HomeData, ExposantData, CMSFetchData, CMSListData } from '~/composables/cms_api'

// Loader court pour l'animation
const { isInitialLoading } = usePageLoading(1500) // 1.5 seconde pour l'animation

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
        query: 'page.info_image.toFiles.first',
        select: {
          alt: "file.alt.value",
          small: "file.resize(400)"
        }
      }
    }
  }
})

</script>

<style lang="scss" scoped>
/* Styles spécifiques à la page d'accueil si nécessaire */
</style>
