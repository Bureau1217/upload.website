<template>
  <div class="event-detail">
    <!-- Titre et type (plus compact) -->
    <div class="event-header">
      <h2>{{ event.title }}</h2>
      <span class="event-type">{{ getEventTypeLabel(event.event_type) }}</span>
    </div>
    
    <!-- Informations essentielles -->
    <div class="event-meta">
      <div v-if="event.date" class="meta-item">
        <strong>Date :</strong> {{ formatDate(event.date) }}
      </div>
      <div v-if="displayTime" class="meta-item">
        <strong>Heure :</strong> {{ displayTime }}
      </div>
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
            <strong>Instructeur :</strong> {{ event.atelier_instructor }}
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
            <strong>Intervenant(s) :</strong> {{ event.speakers }}
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
    <div v-if="event.reservation_enabled === 'true' && event.reservation_url" class="event-reservation">
      <h3>Réservation</h3>
      <p>Cet événement nécessite une réservation préalable.</p>
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