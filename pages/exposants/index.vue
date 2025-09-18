<template>
  <main class="v-exposants">
    <template v-if="data && data.status === 'ok'">
      <section class="section">
        <h1 class="section-title">Graphistes</h1>
      
      <!-- Liste des exposants -->
      <AppExposantsList v-if="exposantsAlphabetiques.length" :exposants="exposantsAlphabetiques" />

        <div v-else>
          <p>Aucun graphiste pour le moment.</p>
        </div>
      </section>
    </template>

    <template v-else-if="status === 'error'">
      <AppLoadingState type="error" message="Erreur de chargement des graphistes" />
    </template>

    <template v-else>
      <AppLoadingState type="loading" />
    </template>
  </main>
</template>

<script setup lang="ts">
import type { ExposantData, CMSListData } from '~/composables/cms_api'
const { data, status } = await useFetch<CMSListData<ExposantData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: "site.find('exposants').children()",
    select: {
      title: true,
      slug: true,
      content_subtitle: true,
      info_category: true,
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

// Trier les exposants par ordre alphabétique
const exposantsAlphabetiques = computed(() => {
  if (!data.value?.result) return []
  return [...data.value.result].sort((a, b) => a.title.localeCompare(b.title))
})
</script>

