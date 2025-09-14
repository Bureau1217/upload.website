<template>
  <main class="v-exposants">
    <template v-if="data && data.status === 'ok'">
      <section class="section">
        <h1 class="section-title">Exposants</h1>
      
      <!-- Liste des exposants -->
      <AppExposantsList v-if="exposantsAleatoires.length" :exposants="exposantsAleatoires" />

        <div v-else>
          <p>Aucun exposant pour le moment.</p>
        </div>
      </section>
    </template>

    <template v-else-if="status === 'error'">
      <div class="error">Erreur de chargement des exposants</div>
    </template>

    <template v-else>
      <div class="loading">Chargement...</div>
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

// Fonction pour mélanger un array de manière aléatoire
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

// Mélanger les exposants de manière aléatoire
const exposantsAleatoires = computed(() => {
  if (!data.value?.result) return []
  return shuffleArray(data.value.result)
})
</script>

