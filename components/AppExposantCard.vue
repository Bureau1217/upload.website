h<template>
  <article class="exposant-card">
    <NuxtLink :to="`/exposants/${exposant.slug}`" class="card-link">
      <!-- Image avec overlay hover -->
      <div class="image-container">
        <img
          v-if="exposant.info_image && imageUrl"
          :src="imageUrl"
          :alt="exposant.info_image?.alt || exposant.title"
          class="exposant-image"
          loading="lazy"
          decoding="async"
          @load="onImageLoad"
          @error="onImageError"
        />
        <div v-else class="image-placeholder">
          Pas d'image
        </div>
        
        <!-- Overlay avec texte au hover -->
        <div class="hover-overlay">
          <div class="overlay-content">
            <div class="overlay-top">
              <h2 class="overlay-title">{{ exposant.title }}</h2>
              <h2 v-if="exposant.content_subtitle" class="overlay-subtitle">
                {{ exposant.content_subtitle }}
              </h2>
            </div>
            <div v-if="exposant.info_category" class="overlay-category">
              {{ getCategoryLabel(exposant.info_category) }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { ExposantData } from '~/composables/cms_api'

interface Props {
  exposant: ExposantData
}

const props = defineProps<Props>()

// Utiliser le composable pour les images CMS
const { getCmsImageUrl } = useCmsImage()

// Image avec cache plus agressif
const imageUrl = computed(() => {
  const image = props.exposant?.info_image
  if (!image) return ''

  // Nouveau format simple avec URL directe
  if ('url' in image && typeof image.url === 'string') {
    return getCmsImageUrl(image.url)
  }

  // Ancien format avec tailles multiples
  if ('small' in image && image.small?.url) {
    return getCmsImageUrl(image.small.url)
  }

  return ''
})

const onImageLoad = () => {
  // Marquer l'image comme chargée pour le cache
}

const onImageError = () => {
  console.warn('Erreur de chargement image:', props.exposant.title)
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
.exposant-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.image-container {
  width: 100%;
  aspect-ratio: 0.707; /* Ratio de 0.707 (portrait) */
  overflow: hidden;
  background-color: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.exposant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.15s ease-out;
  background-color: var(--color-gray);

  /* Améliorer le rendu pendant le chargement */
  &:not([src]) {
    opacity: 0;
  }

  &[src] {
    opacity: 1;
    transition: opacity 0.3s ease-in-out, transform 0.15s ease-out;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray);
  color: var(--color-black);
  font-size: 0.8rem;
}

/* Overlay hover */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1c1c1c;
  display: flex;
  align-items: flex-start; /* Alignement en haut */
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease-out;
  padding: 1rem;
  box-sizing: border-box;
}

.overlay-content {
  text-align: left;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.overlay-top {
  flex-grow: 1;
}

.overlay-title {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
  color: white;
}

.overlay-subtitle {
   font-size: 1.2rem;
  font-weight: bold; /* Style h2 du système */
  font-style: italic;
  line-height: 1.15;
  margin: 0;
  color: white;
  opacity: 0.9;
}

.overlay-category {
  font-size: 1.2rem;
  font-weight: normal;
  color: white;
  opacity: 0.8;
  margin-top: auto;
}

/* Effet hover */
.image-container:hover .hover-overlay {
  opacity: 1;
}

.image-container:hover .exposant-image {
  transform: scale(1.05);
}
</style>