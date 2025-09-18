<template>
  <div class="event-detail">
    <!-- Titre et type (plus compact) -->
    <div class="event-header">
      <h2>{{ event.title }}</h2>
      <span class="event-type">{{ getEventTypeLabel(event.event_type) }}</span>
    </div>
    
    <!-- Informations essentielles -->
    <div class="event-meta">
      <!-- Afficher toutes les dates si plusieurs, sinon format classique -->
      <div v-if="hasMultipleDates(event)" class="meta-item">
        <strong>Dates :</strong>
        <div class="multiple-dates">
          <div v-for="(dateEntry, index) in event.dates" :key="index" class="date-entry">
            {{ formatSingleDate(dateEntry.date) }}
            <span v-if="dateEntry.start_time || dateEntry.end_time" class="time-entry">
              {{ formatTimeRange(dateEntry.start_time, dateEntry.end_time) }}
            </span>
          </div>
        </div>
      </div>
      <!-- Format classique pour un seul événement -->
      <template v-else>
        <div v-if="getEventDate(event)" class="meta-item">
          <strong>Date :</strong> {{ formatDateRange(event) }}
        </div>
        <div v-if="getEventTimeRange(event)" class="meta-item">
          <strong>Heure :</strong> {{ getEventTimeRange(event) }}
        </div>
      </template>
      <div v-if="event.address" class="meta-item">
        <strong>Lieu :</strong> {{ event.address }}
        <a v-if="event.googlemaps" :href="event.googlemaps" target="_blank" class="maps-link">
          Voir sur Google Maps
        </a>
      </div>
    </div>
    
    <!-- Description -->
    <div v-if="event.description" class="event-description">
      <h2>Description</h2>
      <div v-html="event.description" class="content"></div>
    </div>
    
    <!-- Informations spécifiques selon le type -->
    <div v-if="hasSpecificInfo" class="event-specific">
      
      <!-- Informations atelier -->
      <template v-if="event.event_type === 'atelier'">
        <h3>Informations atelier</h3>
        <div class="specific-info">
          <div v-if="event.atelier_instructor" class="info-item">
            <strong>Intervenant(·e·s) :</strong> {{ event.atelier_instructor }}
          </div>
          <div v-if="event.atelier_capacity" class="info-item">
            <strong>Capacité :</strong> {{ event.atelier_capacity }} participants
          </div>
          <div v-if="event.atelier_min_age" class="info-item">
            <strong>Âge minimum :</strong> {{ event.atelier_min_age }} ans
          </div>
        </div>
      </template>
      
      <!-- Informations conférence -->
      <template v-if="event.event_type === 'conference'">
        <h3>Informations conférence</h3>
        <div class="specific-info">
          <div v-if="event.speakers" class="info-item">
            <strong>Intervenant(·e·s) :</strong>
            <span v-html="parseLinksInText(event.speakers)"></span>
          </div>
        </div>
      </template>
      
      <!-- Informations visite -->
      <template v-if="event.event_type === 'visite'">
        <h3>Informations visite</h3>
        <div class="specific-info">
          <div v-if="event.guide_name" class="info-item">
            <strong>Guide :</strong> {{ event.guide_name }}
          </div>
          <div v-if="event.meeting_point" class="info-item">
            <strong>Point de rendez-vous :</strong> {{ event.meeting_point }}
          </div>
        </div>
      </template>
      
    </div>
    
    <!-- Conditions -->
    <div v-if="event.conditions" class="event-conditions">
      <h3>Conditions</h3>
      <div v-html="event.conditions" class="content"></div>
    </div>
    
    <!-- Réservation -->
    <div v-if="(event.reservation_enabled === true || event.reservation_enabled === 'true') && event.reservation_url" class="event-reservation">
      <h3>Réservation</h3>
      <p>Cet événement nécessite une réservation préalable</p>
      <AppButton>
        <a :href="event.reservation_url" target="_blank" class="reservation-link">
          Réserver ma place
        </a>
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventData } from '~/composables/cms_api'

interface Props {
  event: EventData
}

const props = defineProps<Props>()


const getEventTypeLabel = (type: string) => {
  const labels = {
    exposition: 'Exposition',
    conference: 'Conférence',
    atelier: 'Atelier',
    visite: 'Visite guidée'
  }
  return labels[type as keyof typeof labels] || type
}

// Helpers pour récupérer les données de date (compatibilité ancien/nouveau format)
const getEventDate = (event: EventData) => {
  // Prendre la première entrée du tableau dates si elle existe, sinon l'ancien champ
  return event.dates?.[0]?.date || event.date
}

const getEventStartTime = (event: EventData) => {
  return event.dates?.[0]?.start_time || event.start_time
}

const getEventEndTime = (event: EventData) => {
  return event.dates?.[0]?.end_time || event.end_time
}

const getEventEndDate = (event: EventData) => {
  return event.dates?.[0]?.end_date
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-CH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

// Formater la plage de dates
const formatDateRange = (event: EventData) => {
  const startDate = getEventDate(event)
  const endDate = getEventEndDate(event)


  if (!startDate) return ''

  if (endDate && endDate !== startDate) {
    return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`
  }

  return formatDate(startDate)
}

// Formater la plage d'heures
const getEventTimeRange = (event: EventData) => {
  const startTime = getEventStartTime(event)
  const endTime = getEventEndTime(event)


  if (!startTime) return ''

  const formatTime = (time: string) => {
    // Enlever les secondes si présentes et remplacer : par h
    return time.split(':').slice(0, 2).join('h')
  }

  if (endTime) {
    return `${formatTime(startTime)}-${formatTime(endTime)}`
  }

  return formatTime(startTime)
}

// Vérifier si l'événement a plusieurs dates
const hasMultipleDates = (event: EventData) => {
  return event.dates && event.dates.length > 1
}

// Formater une date unique (pour l'affichage multiple)
const formatSingleDate = (dateString: string) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-CH', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  } catch (error) {
    return dateString
  }
}

// Formater une plage d'heures (pour l'affichage multiple)
const formatTimeRange = (startTime: string, endTime?: string) => {
  if (!startTime) return ''

  const formatTime = (time: string) => {
    return time.split(':').slice(0, 2).join('h')
  }

  if (endTime) {
    return `${formatTime(startTime)}-${formatTime(endTime)}`
  }

  return formatTime(startTime)
}

// Parse les liens KirbyText: (link: URL text: TEXTE)
const parseLinksInText = (text: string) => {
  if (!text) return ''
  return text.replace(/\(link:\s*([^\s]+)\s+text:\s*([^)]+)\)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
}

const hasSpecificInfo = computed(() => {
  const { event } = props
  
  if (event.event_type === 'atelier') {
    return event.atelier_instructor || event.atelier_capacity || event.atelier_min_age
  }
  
  if (event.event_type === 'conference') {
    return event.speakers
  }
  
  if (event.event_type === 'visite') {
    return event.guide_name || event.meeting_point
  }
  
  return false
})
</script>

<style lang="scss" scoped>
.event-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-l); /* Gap plus petit pour la carte */
}

.event-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  
  h2 {
    margin: 0;
    font-size: 1.4rem; /* Plus petit que h1 */
    line-height: 1.2;
  }
}

.event-type {
  display: inline-block;
  padding: var(--space-xs) var(--space-s);
  background: var(--color-black);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  .maps-link {
    color: var(--color-black);
    text-decoration: underline;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: none;
    }
  }
}

.event-description,
.event-specific,
.event-conditions,
.event-reservation {
  h2, h3 {
    margin-bottom: var(--space-s);
    font-size: 1.1rem; /* Plus compact */
  }
}

.content {
  line-height: 1.6;
  
  p {
    margin-bottom: var(--space-m);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.specific-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.info-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-s);

  :deep(a) {
    color: var(--color-black);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

.event-reservation {
  padding: var(--space-l);
  border: 2px solid var(--color-black);
  background: var(--color-white);
  
  p {
    margin-bottom: var(--space-m);
  }
  
  .reservation-link {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: inherit;
    }
  }
}

.multiple-dates {
  margin-top: var(--space-xs);
}

.date-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.time-entry {
  font-weight: bold;
  color: var(--color-black);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .event-meta {
    .meta-item {
      strong {
        display: block;
        margin-bottom: var(--space-xs);
      }
    }
  }
}
</style>