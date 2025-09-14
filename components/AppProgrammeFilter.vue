<template>
  <div class="programme-filter">
    <div class="filter-buttons">
      <AppButton 
        @click="setFilter('')"
        :selected="selectedType === ''"
        text="Tous"
      />
      <AppButton 
        @click="setFilter('exposition')"
        :selected="selectedType === 'exposition'"
        text="Exposition"
      />
      <AppButton 
        @click="setFilter('conference')"
        :selected="selectedType === 'conference'"
        text="Conférence"
      />
      <AppButton 
        @click="setFilter('atelier')"
        :selected="selectedType === 'atelier'"
        text="Atelier"
      />
      <AppButton 
        @click="setFilter('visite')"
        :selected="selectedType === 'visite'"
        text="Visite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventData } from '~/composables/cms_api'

interface Props {
  events: EventData[]
}

interface Emits {
  (e: 'filter', filters: { type: string; date: string }): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedType = ref('')

const setFilter = (type: string) => {
  selectedType.value = type
  emit('filter', {
    type: selectedType.value,
    date: ''
  })
}
</script>

<style lang="scss" scoped>
.programme-filter {
  /* Margin removed - now handled by parent container */
}

.filter-buttons {
  display: flex;
  gap: var(--space-m);
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .filter-buttons {
    gap: var(--space-s);
  }
}
</style>