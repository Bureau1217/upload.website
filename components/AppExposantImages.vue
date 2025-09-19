<template>
  <div v-if="images?.length" class="exposant-images">
    <div class="images-gallery">
      <img
        v-for="image in images"
        :key="getImageUrl(image)"
        :src="getCmsImageUrl(getImageUrl(image))"
        :alt="image.alt || `Image de ${exposantName}`"
        class="exposant-image"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CMS_API_ImageObject, CMS_API_PartialImageObject, CMS_API_SimpleImage } from '~/types/cms'

interface Props {
  images: (CMS_API_ImageObject | CMS_API_PartialImageObject | CMS_API_SimpleImage)[]
  exposantName: string
}

defineProps<Props>()

// Utiliser le composable pour les images CMS
const { getCmsImageUrl } = useCmsImage()

// Fonctions helpers pour gérer les différents formats d'images
const getImageUrl = (image: any): string => {
  if (!image) return ''

  // Format avec tailles multiples - utiliser 'reg' ou 'small'
  if ('reg' in image && image.reg?.url) {
    return image.reg.url
  }

  if ('small' in image && image.small?.url) {
    return image.small.url
  }

  // Format simple avec URL directe (fallback)
  if ('url' in image && typeof image.url === 'string') {
    return image.url
  }

  return ''
}

const getImageWidth = (image: any): number | undefined => {
  if ('width' in image && typeof image.width === 'number') {
    return image.width
  }
  if ('reg' in image && image.reg?.width) {
    return image.reg.width
  }
  if ('small' in image && image.small?.width) {
    return image.small.width
  }
  return undefined
}

const getImageHeight = (image: any): number | undefined => {
  if ('height' in image && typeof image.height === 'number') {
    return image.height
  }
  if ('reg' in image && image.reg?.height) {
    return image.reg.height
  }
  if ('small' in image && image.small?.height) {
    return image.small.height
  }
  return undefined
}
</script>

<style lang="scss" scoped>
.exposant-images {
  width: 100%;
}

.images-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxl);
}

.exposant-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  
  // Ombre portée franche vers la gauche en bas en diagonal
  box-shadow: -25px 25px 0px 0px var(--color-black);
}

@media (max-width: 1024px) {
  .images-gallery {
    gap: var(--space-xl);
  }
  
  .exposant-image {
    // Ombre portée plus grande sur mobile
    box-shadow: -10px 10px 0px 0px var(--color-black);
  }
}
</style>