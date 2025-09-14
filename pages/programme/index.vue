<template>
  <main class="v-programme">
    <section class="section">
      <h1>Programme</h1>
      
      <template v-if="data && data.status === 'ok' && evenements?.length">
        <!-- Filtres et PDF -->
        <div class="programme-header">
          <AppProgrammeFilter 
            :events="evenements" 
            @filter="onFilterChange" 
          />
          
          <!-- Lien de téléchargement PDF -->
          <div v-if="programmePdfs?.length" class="pdf-download">
            <h3>
              <a 
                v-for="pdf in programmePdfs" 
                :key="pdf.url"
                :href="getFileUrl(pdf.url)" 
                download
                class="pdf-link"
              >
                Télécharger la grille horaire
              </a>
            </h3>
          </div>
        </div>
        
        <!-- Liste des événements filtrés -->
        <div class="grid-responsive">
          <AppEventCard 
            v-for="event in filteredEvents" 
            :key="event.slug"
            :event="event"
          />
        </div>
        
        <!-- Message si aucun résultat après filtrage -->
        <div v-if="filteredEvents.length === 0 && hasActiveFilters" class="no-results">
          <p>Aucun événement ne correspond aux filtres sélectionnés.</p>
        </div>
      </template>

      <template v-else-if="status === 'error'">
        <div class="error">
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger le programme.</p>
        </div>
      </template>

      <template v-else-if="evenements?.length === 0">
        <div class="empty">
          <h2>Aucun événement</h2>
          <p>Le programme n'est pas encore disponible.</p>
        </div>
      </template>

      <template v-else>
        <div class="loading">Chargement du programme...</div>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { EventData, CMSProgrammeData, CMSFetchData } from '~/composables/cms_api'

const { data, status, error } = await useFetch<CMSFetchData<CMSProgrammeData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site.find("programme")',
    select: {
      title: true,
      slug: true,
      programme_pdf: {
        query: 'page.programme_pdf.toFiles',
        select: {
          url: true,
          filename: true,
          description: true
        }
      },
      children: {
        query: 'page.children().listed()',
        select: {
          title: true,
          slug: true,
          date: true,
          start_time: true,
          end_time: true,
          address: true,
          googlemaps: true,
          description: true,
          conditions: true,
          event_type: true,
          // Test: réactiver le champ image pour voir la structure
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
    }
  }
})

const evenements = computed(() => data.value?.result?.children ?? [])
const programmePdfs = computed(() => data.value?.result?.programme_pdf ?? [])

const getFileUrl = (url: string) => {
  return 'http://localhost:8000' + url
}

// État des filtres
const filters = ref({
  type: '',
  date: ''
})

// Événements filtrés
const filteredEvents = computed(() => {
  let events = evenements.value

  if (filters.value.type) {
    events = events.filter(event => event.event_type === filters.value.type)
  }

  if (filters.value.date) {
    events = events.filter(event => event.date === filters.value.date)
  }

  // Trier par date et heure
  return events.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    
    // Si les dates sont différentes, trier par date
    if (dateA !== dateB) {
      return dateA - dateB
    }
    
    // Si les dates sont identiques, trier par heure de début (start_time)
    if (a.start_time && b.start_time) {
      return a.start_time.localeCompare(b.start_time)
    }
    
    // Si une seule des deux a start_time, celle-ci passe en premier
    if (a.start_time && !b.start_time) return -1
    if (!a.start_time && b.start_time) return 1
    
    return 0
  })
})

// Vérifie s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return filters.value.type || filters.value.date
})

// Gestion des filtres
const onFilterChange = (newFilters: { type: string; date: string }) => {
  filters.value = newFilters
}

// Debug et gestion d'erreur
watchEffect(() => {
  if (status.value === 'error') {
    console.warn('[CMS] Erreur de chargement du programme')
    console.warn('error:', error.value)
    console.warn('data:', data.value)
  }
  
})
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: var(--space-xl);
}

.programme-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-m);
  }
}

.pdf-download {
  display: flex;
  align-items: center;
}

.pdf-download h3 {
  margin: 0;
  font-size: 1rem;
}

.pdf-link {
  color: var(--color-black);
  text-decoration: underline;
  font-weight: bold;
  font-size: 1rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
}

/* Utilise maintenant la classe .grid-responsive globale pour une grille de 6 colonnes */

.no-results {
  text-align: center;
  padding: var(--space-xxl);
  margin-top: var(--space-xl);
  border: 2px dashed #ccc;
  border-radius: 8px;
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.error, .empty, .loading {
  text-align: center;
  padding: var(--space-xxl);
  
  h2 {
    margin-bottom: var(--space-m);
  }
  
  p {
    color: #666;
  }
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
    gap: var(--space-l);
  }
}

@media (max-width: 480px) {
  .events-grid {
    gap: var(--space-m);
  }
}
</style>