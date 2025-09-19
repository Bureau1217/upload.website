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

      <!-- Site web avec menu dropdown si plusieurs liens -->
      <div v-if="exposant.info_link_website" class="button-dropdown">
        <AppButton
          :text="hasMultipleWebsites ? 'Site web ▾' : 'Site web'"
          @click="openWebsite"
        />

        <div v-if="showWebsiteMenu && hasMultipleWebsites" class="dropdown-menu">
          <AppButton
            :text="exposant.info_link_website_text || exposant.info_link_website"
            @click="openSpecificWebsite(exposant.info_link_website)"
          />
          <AppButton
            :text="exposant.info_link_website2_text || exposant.info_link_website2"
            @click="openSpecificWebsite(exposant.info_link_website2)"
          />
        </div>
      </div>

      <!-- Instagram avec menu dropdown si plusieurs liens -->
      <div v-if="exposant.info_link_social" class="button-dropdown">
        <AppButton
          :text="hasMultipleInstagram ? 'Instagram ▾' : 'Instagram'"
          @click="openInstagram"
        />

        <div v-if="showInstagramMenu && hasMultipleInstagram" class="dropdown-menu">
          <AppButton
            :text="exposant.info_link_social_text || exposant.info_link_social"
            @click="openSpecificInstagram(exposant.info_link_social)"
          />
          <AppButton
            :text="exposant.info_link_social2_text || exposant.info_link_social2"
            @click="openSpecificInstagram(exposant.info_link_social2)"
          />
        </div>
      </div>
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
const showWebsiteMenu = ref(false)
const showInstagramMenu = ref(false)

const openBioModal = () => {
  showBioModal.value = true
}

const closeBioModal = () => {
  showBioModal.value = false
}

const hasMultipleWebsites = computed(() => {
  return props.exposant.info_link_website && props.exposant.info_link_website2
})

const hasMultipleInstagram = computed(() => {
  return props.exposant.info_link_social && props.exposant.info_link_social2
})

const openWebsite = () => {
  if (hasMultipleWebsites.value) {
    showWebsiteMenu.value = !showWebsiteMenu.value
    showInstagramMenu.value = false
  } else if (props.exposant.info_link_website) {
    window.open(props.exposant.info_link_website, '_blank')
  }
}

const openInstagram = () => {
  if (hasMultipleInstagram.value) {
    showInstagramMenu.value = !showInstagramMenu.value
    showWebsiteMenu.value = false
  } else if (props.exposant.info_link_social) {
    window.open(props.exposant.info_link_social, '_blank')
  }
}

const openSpecificWebsite = (url: string) => {
  window.open(url, '_blank')
  showWebsiteMenu.value = false
}

const openSpecificInstagram = (url: string) => {
  window.open(url, '_blank')
  showInstagramMenu.value = false
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

.button-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  margin-top: -2px;
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  background: white;
  border: 2px solid var(--color-black);
  padding: var(--space-s);
  width: 250px;
  max-width: calc(100vw - 2rem);

  :deep(.app-button) {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: left;
  }
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