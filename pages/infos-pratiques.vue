<template>
  <main class="v-infos">
    <template v-if="data && data.status === 'ok'">
      
      <section class="section">
        <h2>{{ data.result?.title || 'Infos Pratiques' }}</h2>
      
        <!-- Horaires -->
        <section v-if="data.result?.horaires">
          <h3>Horaires d'ouverture</h3>
          <div v-html="data.result.horaires"></div>
        </section>

        <!-- Lieux de la biennale -->
        <section v-if="data.result?.lieu_biennale?.length">
          <h3>Lieux de la biennale</h3>
          <div v-for="lieu in data.result.lieu_biennale" :key="lieu.nom" class="lieu-item">
            <p class="lieu-nom">{{ lieu.nom }}</p>
            <p class="lieu-adresse">
              <a v-if="lieu.maps" :href="lieu.maps" target="_blank" class="address-link">
                {{ lieu.adresse }}
              </a>
              <span v-else>{{ lieu.adresse }}</span>
            </p>
          </div>
        </section>

        <!-- Autres lieux -->
        <section v-if="data.result?.autres_lieux?.length">
          <h3>Autres lieux</h3>
          <div v-for="lieu in data.result.autres_lieux" :key="lieu.nom" class="lieu-item">
            <p class="lieu-nom">{{ lieu.nom }}</p>
            <p class="lieu-adresse">
              <a v-if="lieu.maps" :href="lieu.maps" target="_blank" class="address-link">
                {{ lieu.adresse }}
              </a>
              <span v-else>{{ lieu.adresse }}</span>
            </p>
          </div>
        </section>

        <!-- Accessibilité -->
        <section v-if="data.result?.accessibilite">
          <h3>Accessibilité</h3>
          <div v-html="data.result.accessibilite"></div>
        </section>

        <!-- Contact -->
        <section v-if="data.result?.contact_email || data.result?.instagram_label">
          <h3>Contact</h3>
          <p v-if="data.result.contact_email">
           <a :href="'mailto:' + data.result.contact_email">{{ data.result.contact_email }}</a>
          </p>
          <p v-if="data.result.instagram_label && data.result.instagram_url">
          <a :href="data.result.instagram_url" target="_blank">{{ data.result.instagram_label }}</a>
          </p>
        </section>

        <!-- Logos des partenaires -->
        <section v-if="data.result?.partners_logos?.length" class="partners-logos">
          <div class="logos-grid">
            <div 
              v-for="logo in data.result.partners_logos" 
              :key="logo.url" 
              class="logo-item"
            >
              <img 
                :src="`http://localhost:8000${logo.url}`" 
                :alt="logo.alt || 'Logo partenaire'" 
                :width="logo.width"
                :height="logo.height"
              />
            </div>
          </div>
        </section>

      </section>
    </template>

    <template v-else-if="status === 'error'">
      <div class="error">Erreur de chargement des infos pratiques</div>
    </template>

    <template v-else>
      <div class="loading">Chargement...</div>
    </template>
    
  </main>
</template>

<script setup lang="ts">
import type { InfosPratiquesData, CMSFetchData } from '~/composables/cms_api'

const { data, status } = await useFetch<CMSFetchData<InfosPratiquesData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: "site.find('infospratiques')",
    select: {
      title: true,
      slug: true,
      horaires: true,
      lieu_biennale: {
        query: 'page.lieu_biennale.toStructure()',
        select: {
          nom: 'structureItem.nom.value',
          adresse: 'structureItem.adresse.value',
          maps: 'structureItem.maps.value'
        }
      },
      autres_lieux: {
        query: 'page.autres_lieux.toStructure()',
        select: {
          nom: 'structureItem.nom.value',
          adresse: 'structureItem.adresse.value',
          maps: 'structureItem.maps.value'
        }
      },
      accessibilite: true,
      contact_email: true,
      instagram_label: true,
      instagram_url: true,
      partners_logos: {
        query: 'page.partners_logos.toFiles',
        select: {
          url: true,
          alt: true,
          width: true,
          height: true
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
/* .v-infos - pas de styles nécessaires, utilise .section */

h2 {
  margin-bottom: var(--space-l);
}

section {
  margin-bottom: var(--space-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    margin-bottom: var(--space-s);
  }
  
  div {
    :deep(p) {
      margin-bottom: var(--space-m);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.lieu-item {
  margin-bottom: var(--space-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.lieu-nom {
  margin-bottom: var(--space-xs) !important;
}

.lieu-adresse {
  margin-bottom: var(--space-s) !important;
}

.address-link {
  text-decoration: none !important;
  color: inherit;
  
  &:hover {
    text-decoration: underline !important;
  }
}

a {
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: underline;
  }
}

.error, .loading {
  text-align: center;
  padding: var(--space-xl);
}

.partners-logos {
  margin-top: var(--space-xxl);
}

.logos-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-m);
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-s);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.logo-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-s);
  
  img {
    width: 170px;
    height: 100px;
    object-fit: contain;
  }
}
</style>