<template>
  <div v-if="images?.length" class="exposant-images">
    <div class="images-gallery">
      <img 
        v-for="image in images" 
        :key="image.url" 
        :src="'http://localhost:8000' + image.url" 
        :alt="image.alt || `Image de ${exposantName}`" 
        class="exposant-image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageData {
  url: string
  alt: string
  width: number
  height: number
}

interface Props {
  images: ImageData[]
  exposantName: string
}

const props = defineProps<Props>()
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