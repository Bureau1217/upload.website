<template>
  <div class="apropos-images">
    <div v-if="images && images.length" class="grid-responsive">
      <div 
        v-for="(image, index) in images" 
        :key="`apropos-image-${index}`"
        class="image-item"
      >
        <img 
          :src="getImageUrl(image)" 
          :alt="image.alt || `Image à propos ${index + 1}`" 
          class="apropos-image" 
        />
      </div>
    </div>
    
    <div v-else class="no-images">
      <p>Aucune image disponible</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageData {
  url: string
  alt?: string
  width?: number
  height?: number
}

interface Props {
  images: ImageData[]
}

const props = defineProps<Props>()

const getImageUrl = (image: ImageData) => {
  if (image.url.startsWith('http')) {
    return image.url
  }
  return `http://localhost:8000${image.url}`
}
</script>

<style lang="scss" scoped>
.apropos-images {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-item {
  aspect-ratio: 0.707;
  overflow: hidden;
  background-color: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.apropos-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.no-images {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: var(--color-gray);
  border-radius: var(--radius-s);
  
  p {
    opacity: 0.7;
  }
}
</style>