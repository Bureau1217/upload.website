<template>
  <div class="apropos-text">
    <!-- Titre principal -->
    <h1 class="section-title">{{ apropos.title }}</h1>
    
    <!-- Contenu principal -->
    <div v-if="apropos.content" class="apropos-content" v-html="apropos.content"></div>
    
    <!-- Informations complémentaires -->
    <div v-if="apropos.info_additional" class="apropos-info">
      <div v-html="apropos.info_additional" class="info-text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AProposData {
  title: string
  content?: string
  info_additional?: string
}

interface Props {
  apropos: AProposData
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.apropos-text {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  margin-bottom: var(--space-l);
}

.apropos-content {
  margin-bottom: var(--space-xl);
  
  :deep(p) {
    margin-bottom: var(--space-m);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(h2),
  :deep(h3) {
    margin-top: var(--space-l);
    margin-bottom: var(--space-s);
    
    &:first-child {
      margin-top: 0;
    }
  }
}

.apropos-info {
  margin-top: auto;
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-black);
  
  .info-text {
    :deep(p) {
      margin-bottom: var(--space-s);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>