<template>
  <div :class="stateClass">
    <h2 v-if="title">{{ title }}</h2>
    <div v-if="type === 'loading'">Chargement...</div>
    <div v-else>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'loading' | 'error' | 'empty'
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Contenu non disponible'
})

const stateClass = computed(() => {
  switch (props.type) {
    case 'loading':
      return 'loading-state'
    case 'error':
      return 'error-state'
    case 'empty':
      return 'empty-state'
    default:
      return 'loading-state'
  }
})
</script>

<style lang="scss" scoped>
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: var(--space-xxl);

  h2 {
    margin-bottom: var(--space-m);
    font-size: 1.5rem;
    font-weight: bold;
  }

  div {
    color: #666;
    font-size: 1.1rem;
  }
}

.error-state {
  h2, div {
    color: #d32f2f;
  }
}
</style>