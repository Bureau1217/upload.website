<template>
  <div class="event-image">
    <div v-if="image?.url" class="image-container">
      <img 
        :src="'http://localhost:8000' + image.url"
        :alt="image.alt || eventName"
        :width="image.width"
        :height="image.height"
        class="main-image"
      />
      
      <div class="image-info">
        <h3>{{ eventName }}</h3>
        <div class="image-meta">
          <span v-if="image.width && image.height" class="dimensions">
            {{ image.width }} × {{ image.height }}px
          </span>
          <span v-if="image.filename" class="filename">
            {{ image.filename }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="no-image">
      <div class="placeholder">
        <h3>{{ eventName }}</h3>
        <p>Aucune image disponible pour cet événement</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventData } from '~/composables/cms_api'

interface Props {
  image?: EventData['image']
  eventName: string
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.event-image {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.image-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.main-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 1px solid var(--color-black);
}

.image-info {
  h3 {
    margin-bottom: var(--space-s);
    font-size: 1.1rem;
  }
}

.image-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: 0.85rem;
  color: #666;
}

.no-image {
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  padding: var(--space-xl);
  background: var(--color-gray);
  border: 2px dashed #999;
  border-radius: 8px;
  width: 100%;
  
  h3 {
    margin-bottom: var(--space-m);
    color: var(--color-black);
  }
  
  p {
    color: #666;
    font-style: italic;
  }
}

@media (max-width: 768px) {
  .image-meta {
    font-size: 0.8rem;
  }
}
</style>