<template>
  <article class="event-card" :class="{ 'is-expanded': isExpanded }">
    <div class="card-header" @click="toggleExpanded">
      <!-- Image avec overlay hover -->
      <div class="image-container">
        <img 
          v-if="event.image?.url"
          :src="getImageUrl(event.image.url)" 
          :alt="event.image.alt || event.title" 
          class="event-image" 
        />
        <div v-else class="image-placeholder">
          {{ getEventTypeLabel(event.event_type) }}
        </div>
        
        <!-- Overlay avec texte au hover -->
        <div class="hover-overlay">
          <div class="overlay-content">
            <h2 class="overlay-title">{{ event.title }}</h2>
            <div class="event-meta">
              <div class="meta-item">
                {{ getEventTypeLabel(event.event_type) }}
              </div>
              <div v-if="event.date" class="meta-item">
                {{ formatDate(event.date) }}
              </div>
              <div v-if="displayTime" class="meta-item">
                {{ displayTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <!-- Modal-style overlay quand déplié -->
    <div v-if="isExpanded" class="event-modal-overlay" @click="closeModal">
      <div class="event-modal-content" @click.stop>
        <!-- Bouton fermer (croix) -->
        <button class="close-button" @click="toggleExpanded" aria-label="Fermer">
          <span class="close-icon">×</span>
        </button>
        
        <!-- Contenu de l'événement (sans image) -->
        <div class="event-details-content">
          <AppEventDetail :event="event" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { EventData } from '~/composables/cms_api'
import { onUnmounted } from 'vue'

interface Props {
  event: EventData
}

const props = defineProps<Props>()

const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  // Désactiver/réactiver le scroll du body
  if (isExpanded.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeModal = () => {
  isExpanded.value = false
  // Réactiver le scroll du body
  document.body.style.overflow = ''
}

const getEventTypeLabel = (type: string) => {
  const labels = {
    exposition: 'Exposition',
    conference: 'Conférence',
    atelier: 'Atelier',
    visite: 'Visite guidée'
  }
  return labels[type as keyof typeof labels] || type
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1 // getMonth() retourne 0-11
    return `${day}.${month}`
  } catch (error) {
    return dateString
  }
}

const displayTime = computed(() => {
  if (!props.event.start_time) return ''
  
  const formatTime = (time: string) => {
    // Enlever les secondes si présentes et remplacer : par h
    return time.split(':').slice(0, 2).join('h')
  }
  
  return props.event.end_time 
    ? `${formatTime(props.event.start_time)}-${formatTime(props.event.end_time)}`
    : formatTime(props.event.start_time)
})

const getImageUrl = (url: string) => {
  // Simple URL sans cache-busting constant - le refresh de la page suffira
  return 'http://localhost:8000' + url
}

// Nettoyer le scroll au démontage du composant
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  cursor: pointer;
  position: relative;
}

.image-container {
  width: 100%;
  aspect-ratio: 0.707; /* Même ratio que les exposants (portrait) */
  overflow: hidden;
  background-color: var(--color-gray);
  position: relative;
  /* Retiré display: flex pour que l'image remplisse complètement */
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  display: block; /* S'assurer que l'image est en block */
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray);
  color: var(--color-black);
  font-size: 0.8rem;
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
}

/* Overlay hover */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(28, 28, 28, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
  box-sizing: border-box;
}

.overlay-content {
  text-align: left;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.overlay-title {
  font-size: 1.2rem;
  font-weight: bold;
  font-style: italic;
  line-height: 1.2;
  margin: 0;
  color: white;
}

.event-meta {
  .meta-item {
    font-size: 1.2rem; /* Même taille que h2 */
    font-weight: bold; /* Même style que h2 */
    line-height: 1.15; /* Même line-height que h2 */
    margin-bottom: var(--space-xs);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* Effet hover */
.card-header:hover .hover-overlay {
  opacity: 1;
}

.card-header:hover .event-image {
  transform: scale(1.05);
}

/* Modal style comme AppBioModal */
.event-modal-overlay {
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

.event-modal-content {
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

.event-details-content {
  padding: var(--space-xl) var(--space-l) var(--space-l) var(--space-l);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-m) var(--space-m) var(--space-m);
  }
}
</style>