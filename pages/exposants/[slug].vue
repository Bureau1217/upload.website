<template>
  <main class="v-exposant-detail section">
    <template v-if="data && data.status === 'ok' && exposant">
      
      <div class="exposant-layout">
        <!-- Colonne de gauche : Détails du participant -->
        <div class="exposant-text-column">
          <AppExposantDetail :exposant="exposant" />
          
        </div>
        
        <!-- Colonne de droite : Images -->
        <div class="exposant-image-column">
          <AppExposantImages 
            :images="exposant.info_image || []" 
            :exposant-name="exposant.title" 
          />
        </div>
      </div>
      
      <!-- Liste des exposants en bas -->
      <div class="autres-exposants" v-if="allExposants?.length">
        <h2>Exposants</h2>
        <AppExposantsList :exposants="allExposants" />
      </div>

    </template>

    <template v-else-if="status === 'error' || !exposant">
      <div class="error">
        <h1>Exposant introuvable</h1>
        <p>Cet exposant n'existe pas ou n'est pas disponible.</p>
        <NuxtLink to="/exposants">← Retour aux exposants</NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="loading">Chargement...</div>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { ExposantData, CMSFetchData, CMSListData } from '~/composables/cms_api'
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Récupérer l'exposant individuel
const { data, status } = await useFetch<CMSFetchData<ExposantData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: `site.find("exposants").children().find("${slug.value}")`,
    select: {
      title: true,
      slug: true,
      content_subtitle: true,
      content_body: true,
      content_descriptif: true,
      info_category: true,
      info_bio_studio: true,
      info_link_website: true,
      info_link_social: true,
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

// Récupérer tous les exposants pour la liste
const { data: allExposantsData } = await useFetch<CMSListData<ExposantData>>('/api/CMS_KQLRequest', {
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

const exposant = computed(() => data.value?.result ?? null)
const allExposants = computed(() => {
  const exposants = allExposantsData.value?.result || []
  // Exclure l'exposant actuel de la liste et mélanger aléatoirement
  const autresExposants = exposants.filter(exp => exp.slug !== slug.value)
  return shuffleArray(autresExposants)
})

</script>

<style lang="scss" scoped>

.exposant-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}

.exposant-text-column {
  display: flex;
  flex-direction: column;
}

.exposant-image-column {
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: var(--space-xl);
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-black);
  
  a {
    color: var(--color-black);
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error, .loading {
  text-align: center;
  padding: var(--space-xl);
}

.autres-exposants {
  margin-top: var(--space-xxl);
  border-top: 1px solid var(--color-black);
  
  h2 {
    margin-bottom: var(--space-xl);
  }
}
</style>