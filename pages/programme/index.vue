<template>
  <!-- Loader en dehors du main comme les autres pages -->
  <template v-if="status === 'pending'">
    <AppLoadingState type="loading" />
  </template>

  <!-- Contenu de la page -->
  <main v-else class="v-programme">
    <section class="section">
      <template v-if="data && data.status === 'ok' && evenements?.length">
        <h1>Programme</h1>
        <!-- Filtres et PDF -->
        <div class="programme-header">
          <AppProgrammeFilter
            :events="evenements"
            @filter="onFilterChange"
          />

          <!-- Lien de téléchargement PDF -->
          <div class="pdf-download">
            <h3>
              <!-- Si un PDF est configuré dans le CMS -->
              <template v-if="programmePdfs?.length && programmePdfs[0]">
                <a
                  :href="getFileUrl(programmePdfs[0].url)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pdf-link"
                >
                  Télécharger la grille horaire
                </a>
              </template>
              <!-- Lien temporaire si aucun PDF configuré -->
              <template v-else>
                <a
                  href="#"
                  class="pdf-link disabled"
                  @click.prevent="handleMissingPdf"
                >
                  Télécharger la grille horaire
                </a>
              </template>
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

        <!-- Planning détaillé -->
        <AppPlanning :planning-content="planningSchedule" />
      </template>

      <template v-else-if="status === 'error'">
        <AppLoadingState type="error" title="Erreur de chargement" message="Impossible de charger le programme." />
      </template>

      <template v-else-if="status === 'success' && evenements?.length === 0">
        <AppLoadingState type="empty" title="Aucun événement" message="Le programme n'est pas encore disponible." />
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { CMSProgrammeData, CMSFetchData } from '~/composables/cms_api'

const { data, status, error } = await useFetch<CMSFetchData<CMSProgrammeData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site.find("programme")',
    select: {
      title: true,
      slug: true,
      programme_schedule: true,
      programme_pdf: {
        query: 'page.programme_pdf.toFiles',
        select: {
          url: true,
          filename: true,
          description: true
        }
      },
      programme_pdf_direct: 'page.programme_pdf',
      all_files: {
        query: 'page.files.filterBy("extension", "pdf")',
        select: {
          url: true,
          filename: true,
          description: true
        }
      },
      pdf_templates: {
        query: 'page.files.filterBy("template", "pdf")',
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
          dates: {
            query: 'page.dates.toStructure',
            select: {
              date: true,
              end_date: true,
              start_time: true,
              end_time: true
            }
          },
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
const programmePdfs = computed(() => {
  // Utiliser d'abord les PDFs assignés au champ programme_pdf
  const assignedPdfs = data.value?.result?.programme_pdf ?? []
  if (assignedPdfs.length > 0) {
    return assignedPdfs
  }

  // Essayer les fichiers avec template PDF
  const templatePdfs = data.value?.result?.pdf_templates ?? []
  if (templatePdfs.length > 0) {
    return templatePdfs
  }

  // Sinon, filtrer les fichiers PDF par nom pour trouver la grille horaire
  const allFiles = data.value?.result?.all_files ?? []
  return allFiles.filter(file => {
    const filename = file.filename.toLowerCase()
    return filename.includes('grille') ||
           filename.includes('horaire') ||
           filename.includes('programme') ||
           filename.includes('planning')
  })
})
const planningSchedule = computed(() => data.value?.result?.programme_schedule ?? '')

// Utiliser le composable pour les images CMS
const { getCmsImageUrl } = useCmsImage()

const getFileUrl = (url: string) => {
  return getCmsImageUrl(url)
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
    events = events.filter(event => {
      const eventDate = event.dates?.[0]?.date || event.date
      return eventDate === filters.value.date
    })
  }

  // Retourner les événements dans l'ordre du CMS (sans tri)
  return events
})

// Vérifie s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return filters.value.type || filters.value.date
})

// Gestion des filtres
const onFilterChange = (newFilters: { type: string; date: string }) => {
  filters.value = newFilters
}

// Gestion du clic sur le PDF manquant
const handleMissingPdf = () => {
  alert('Le PDF de la grille horaire n\'est pas encore disponible. Veuillez configurer le fichier PDF dans le panel d\'administration.')
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
  font-size: 1.25rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
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