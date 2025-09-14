<template>
  <div class="bio-modal-overlay" @click="closeModal">
    <div class="bio-modal-content" @click.stop>
      <!-- Bouton fermer (croix) -->
      <button class="close-button" @click="closeModal" aria-label="Fermer">
        <span class="close-icon">×</span>
      </button>
      
      <!-- Contenu de la bio -->
      <div class="bio-text" v-html="bioText"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  bioText: string
}

interface Emits {
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('close')
}

// Fermer avec Escape et empêcher le scroll
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  // Empêcher le scroll du body
  document.body.style.overflow = 'hidden'
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  })
})
</script>

<style lang="scss" scoped>
.bio-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-l);
  
  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    justify-content: flex-start;
  }
}

.bio-modal-content {
  background-color: var(--color-white);
  border: 5px solid var(--color-black);
  max-width: 700px;
  width: 100%;
  max-height: 75vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  /* Rectangle blanc en haut avec dégradé - fixé au haut du bloc */
  &::before {
    content: '';
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 2rem;
    background: linear-gradient(to bottom, white 0%, white 50%, rgba(255, 255, 255, 0) 100%);
    z-index: 3;
    flex-shrink: 0;
  }
  
  /* Rectangle blanc en bas avec dégradé - fixé au bas du bloc */
  &::after {
    content: '';
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2rem;
    background: linear-gradient(to top, white 0%, white 50%, rgba(255, 255, 255, 0) 100%);
    z-index: 3;
    flex-shrink: 0;
    margin-top: auto;
  }
  
  @media (max-width: 768px) {
    max-width: none;
    width: calc(100vw - 2rem);
    height: calc(100vh - 2rem);
    max-height: none;
  }
}

.close-button {
  position: absolute;
  top: var(--space-s);
  right: var(--space-s);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}

.close-icon {
  font-size: 3rem;
  font-weight: 300;
  color: var(--color-black);
  line-height: 1;
}

.bio-text {
  padding: var(--space-xl) var(--space-l) var(--space-l) var(--space-l);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-m) var(--space-m) var(--space-m);
  }
  
  :deep(p) {
    margin-bottom: var(--space-m);
    line-height: 1.4;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin-bottom: var(--space-s);
    margin-top: var(--space-l);
    
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>