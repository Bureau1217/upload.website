<template>
  <article class="exposant-detail">
    <!-- Nom du participant -->
    <h1 class="exposant-name">{{ exposant.title }}</h1>
    
    <!-- Sous-titre -->
    <h2 v-if="exposant.content_subtitle" class="exposant-subtitle">
      {{ exposant.content_subtitle }}
    </h2>
    
    <!-- Catégorie -->
    <h3 v-if="exposant.info_category" class="exposant-category">
      {{ getCategoryLabel(exposant.info_category) }}
    </h3>
    
    <!-- Contenu principal -->
    <div v-if="exposant.content_body" class="exposant-content" v-html="exposant.content_body"></div>
    
    <!-- Description technique -->
    <div v-if="exposant.content_descriptif" class="exposant-descriptif">
      <h3>DESCRIPTIF</h3>
      <div v-html="exposant.content_descriptif" class="descriptif-content"></div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="action-buttons">
      <AppButton 
        v-if="exposant.info_bio_studio" 
        text="Bio" 
        @click="openBioModal"
      />
      
      <AppButton 
        v-if="exposant.info_link_website" 
        text="Site web" 
        @click="openWebsite"
      />
      
      <AppButton 
        v-if="exposant.info_link_social" 
        text="Instagram" 
        @click="openInstagram"
      />
    </div>
    
    <!-- Modal Bio -->
    <AppBioModal 
      v-if="showBioModal" 
      :bio-text="exposant.info_bio_studio" 
      @close="closeBioModal" 
    />
  </article>
</template>

<script setup lang="ts">
import type { ExposantData } from '~/composables/cms_api'

interface Props {
  exposant: ExposantData
}

const props = defineProps<Props>()

const showBioModal = ref(false)

const openBioModal = () => {
  showBioModal.value = true
}

const closeBioModal = () => {
  showBioModal.value = false
}

const openWebsite = () => {
  if (props.exposant.info_link_website) {
    window.open(props.exposant.info_link_website, '_blank')
  }
}

const openInstagram = () => {
  if (props.exposant.info_link_social) {
    window.open(props.exposant.info_link_social, '_blank')
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    signaletique: 'Signalétique & Scénographie',
    transversaux: 'Projets transversaux',
    branding: 'Branding',
    police: 'Dessin de police caractères',
    edition: 'Édition',
    identite: 'Identité culturelle'
  }
  return labels[category] || category
}
</script>

<style lang="scss" scoped>
.exposant-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.exposant-name {
  margin-bottom: var(--space-s);
}

.exposant-subtitle {
  margin-bottom: var(--space-s);
  font-style: italic;
}

.exposant-category {
  margin-bottom: var(--space-xl);
  font-weight: normal;
}

.exposant-content {
  margin-bottom: var(--space-xl);
}

.exposant-descriptif {
  margin-bottom: var(--space-xl);
  
  h3 {
    margin-bottom: var(--space-m);
  }
  
  .descriptif-label {
    margin-bottom: var(--space-s);
  }
}

.action-buttons {
  margin-top: var(--space-xl);
  display: flex;
  gap: var(--space-m);
  flex-wrap: wrap;
}

/* Espacement des paragraphes dans le contenu */
.exposant-content {
  :deep(p) {
    margin-bottom: var(--space-m);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.descriptif-content {
  :deep(p) {
    font-size: 0.8rem;
    font-weight: 400;
    margin-bottom: var(--space-m);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>