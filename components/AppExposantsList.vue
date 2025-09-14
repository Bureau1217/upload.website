<template>
  <div class="grid-responsive">
    <AppExposantCard
      v-for="exposant in exposants"
      :key="exposant.slug"
      :exposant="exposant"
    />
  </div>
</template>

<script setup lang="ts">
import type { ExposantData } from '~/composables/cms_api'

interface Props {
  exposants: ExposantData[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
/* Le styling de la grille est maintenant géré par la classe utilitaire .grid-responsive dans _main.scss */
</style>