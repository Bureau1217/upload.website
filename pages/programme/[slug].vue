<template>
  <main class="v-event-detail">
    <template v-if="data && data.status === 'ok' && evenement">
      
      <div class="event-layout">
        <!-- Colonne de gauche : Détails de l'événement -->
        <div class="event-text-column">
          <AppEventDetail :event="evenement" />
          
          <!-- Bouton retour -->
          <div class="footer">
            <NuxtLink to="/programme">← Retour au programme</NuxtLink>
          </div>
        </div>
        
        <!-- Colonne de droite : Image -->
        <div class="event-image-column">
          <AppEventImage 
            :image="evenement.image" 
            :event-name="evenement.title" 
          />
        </div>
      </div>

    </template>

    <template v-else-if="status === 'error' || !evenement">
      <div class="error">
        <h1>Événement introuvable</h1>
        <p>Cet événement n'existe pas ou n'est pas disponible.</p>
        <NuxtLink to="/programme">← Retour au programme</NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="loading">Chargement...</div>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { EventData, CMSFetchData } from '~/composables/cms_api'
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, status, error } = await useFetch<CMSFetchData<EventData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: `site.find("programme").children().find("${slug.value}")`,
    select: {
      title: true,
      slug: true,
      date: true,
      time: true,
      address: true,
      googlemaps: true,
      description: true,
      conditions: true,
      event_type: true,
      image: true,
      // Champs spécifiques aux ateliers
      atelier_min_age: true,
      atelier_instructor: true,
      atelier_capacity: true,
      // Champs spécifiques aux conférences
      speakers: true,
      // Champs spécifiques aux visites
      meeting_point: true,
      guide_name: true,
      // Réservation
      reservation_enabled: true,
      reservation_url: true
    }
  }
})

const evenement = computed(() => data.value?.result ?? null)

// Debug et gestion d'erreur
watchEffect(() => {
  if (status.value === 'error' || !evenement.value) {
    console.warn('[CMS] Événement introuvable ou erreur KQL')
    console.warn('slug:', slug.value)
    console.warn('data:', data.value)
    console.warn('error:', error.value)
  }
})
</script>

<style lang="scss" scoped>
.v-event-detail {
  padding: var(--space-xl) 2rem;

  @media (max-width: 768px) {
    padding: var(--space-xl) 1rem;
  }
}

.event-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}

.event-text-column {
  display: flex;
  flex-direction: column;
}

.event-image-column {
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: var(--space-xl);
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-black);
  
  a {
    color: var(--color-black);
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error, .loading {
  text-align: center;
  padding: var(--space-xl);
}
</style>