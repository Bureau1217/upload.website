<template>
  <div class="programme-text">
    <h1 class="section-title">Programme</h1>
    
    <template v-if="evenements?.length">
      <div class="events-list">
        <article 
          v-for="event in evenements" 
          :key="event.slug"
          class="event-card"
        >
          <NuxtLink :to="`/programme/${event.slug}`" class="event-link">
            <h3 class="event-title">{{ event.title }}</h3>
            
            <!-- Date et heure -->
            <div v-if="event.date || event.time" class="event-datetime">
              <span v-if="event.date" class="date">{{ formatDate(event.date) }}</span>
              <span v-if="event.time" class="time">{{ event.time }}</span>
            </div>
            
            <!-- Lieu -->
            <div v-if="event.address" class="event-location">
              {{ event.address }}
            </div>
            
            <!-- Description courte -->
            <div v-if="event.description" class="event-description" v-html="event.description"></div>
            
            <!-- Conditions -->
            <div v-if="event.conditions" class="event-conditions">
              <small>{{ event.conditions }}</small>
            </div>
          </NuxtLink>
        </article>
      </div>
    </template>

    <template v-else>
      <div class="empty">
        <p>Le programme n'est pas encore disponible.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { EventData } from '~/composables/cms_api'

interface Props {
  evenements: EventData[]
}

const props = defineProps<Props>()

const formatDate = (date: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return date
  }
}
</script>

<style lang="scss" scoped>
.programme-text {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  margin-bottom: var(--space-l);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.event-card {
  border-bottom: 1px solid var(--color-black);
  padding-bottom: var(--space-l);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.event-link {
  display: block;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    .event-title {
      text-decoration: underline;
    }
  }
}

.event-title {
  margin-bottom: var(--space-s);
}

.event-datetime {
  display: flex;
  gap: var(--space-m);
  margin-bottom: var(--space-s);
  font-weight: bold;
  
  .date, .time {
    font-size: 0.9rem;
  }
}

.event-location {
  margin-bottom: var(--space-s);
  font-style: italic;
}

.event-description {
  margin-bottom: var(--space-s);
  
  :deep(p) {
    margin-bottom: var(--space-s);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.event-conditions {
  font-size: 0.8rem;
  opacity: 0.8;
}

.empty {
  text-align: center;
  padding: var(--space-xl);
  opacity: 0.7;
}
</style>