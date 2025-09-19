<template>
  <div class="planning" v-if="planningContent">
    <h2 class="planning-title">Programme conférences 4 octobre</h2>
    <div class="planning-content" v-html="planningContent"></div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  planningContent?: string
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.planning {
  margin-top: var(--space-xxl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-black);
}

.planning-title {
  margin-bottom: var(--space-l);
  font-size: 1.5rem;
  font-weight: bold;
}

.planning-content {
  :deep(p) {
    margin-bottom: var(--space-m);
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(strong) {
    font-weight: bold;
  }
}
</style>