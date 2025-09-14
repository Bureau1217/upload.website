<template>
  <main class="v-apropos">
    <template v-if="data && data.status === 'ok'">
      
      <section class="section">
        <!-- Section Biennale -->
        <div class="biennale-section">
          <!-- Colonne gauche : Contenu biennale -->
          <div class="content-text-column">
            <h1 v-if="data.result.biennale_title">{{ data.result.biennale_title }}</h1>
            <div v-if="data.result.biennale_description" 
                 v-html="data.result.biennale_description" 
                 class="biennale-description"></div>
            
            <!-- Crédits et Commissariat -->
            <div class="credits-section">
              <div v-if="data.result.commissariat_block1" class="credits">
                <div v-html="data.result.commissariat_block1" class="credits-content"></div>
              </div>
              
              <div v-if="data.result.commissariat_block2" class="commissariat">
                <div v-html="data.result.commissariat_block2" class="commissariat-content"></div>
              </div>
            </div>
          </div>
          
          <!-- Colonne droite : Image biennale -->
          <div class="content-image-column">
            <div v-if="data.result.biennale_image" class="image-container">
              <img :src="'http://localhost:8000' + data.result.biennale_image" 
                   alt="Image de la biennale" 
                   class="full-image" />
            </div>
            <div v-else class="no-image">
              <p>Aucune image disponible</p>
            </div>
          </div>
        </div>

        <!-- Section Partenaires -->
        <div v-if="data.result?.partners_title" class="partners-section">
          <!-- Colonne gauche : Contenu partenaires -->
          <div class="content-text-column">
            <h2>{{ data.result.partners_title }}</h2>
            <div v-if="data.result.partners_text" 
                 v-html="data.result.partners_text" 
                 class="partners-text"></div>
          </div>
          
          <!-- Colonne droite : Logos des partenaires -->
          <div class="content-image-column">
            <div v-if="data.result.partners_logos?.length" class="partners-logos">
              <img 
                v-for="logo in data.result.partners_logos" 
                :key="logo.url"
                :src="'http://localhost:8000' + logo.url" 
                :alt="logo.alt || 'Logo partenaire'" 
                class="partner-logo" 
              />
            </div>
            <div v-else class="no-image">
              <p>Logos partenaires à venir</p>
            </div>
          </div>
        </div>
      </section>

    </template>

    <template v-else-if="status === 'error'">
      <div class="error">Erreur de chargement de la page À propos</div>
    </template>

    <template v-else>
      <div class="loading">Chargement...</div>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { AproposData, CMSFetchData } from '~/composables/cms_api'

const { data, status } = await useFetch<CMSFetchData<AproposData>>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: "site.find('apropos')",
    select: {
      title: true,
      slug: true,
      biennale_title: true,
      biennale_description: true,
      commissariat_block1: true,
      commissariat_block2: true,
      biennale_image: "page.biennale_image.toFile.url",
      partners_title: true,
      partners_text: true,
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
/* .v-apropos - pas de styles nécessaires, utilise .section et .container */

/* Utilise la classe .container globale au lieu de .apropos-layout */

.biennale-section,
.partners-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);
  margin-bottom: var(--space-xxl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.content-text-column {
  display: flex;
  flex-direction: column;
  
  h1 {
    margin-bottom: var(--space-l);
  }
  
  h2 {
    margin-bottom: var(--space-m);
  }
  
  .biennale-description,
  .partners-text {
    margin-bottom: var(--space-xl);
    
    :deep(p) {
      margin-bottom: var(--space-m);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .partners-text {
    font-style: normal;
    
    :deep(p) {
      font-style: normal;
    }
  }
}

.content-image-column {
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 100%;
}

.full-image {
  width: 60%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.credits-section {
  .credits, .commissariat {
    margin-bottom: var(--space-l);
    
    .credits-content, .commissariat-content {
      :deep(p) {
        margin-bottom: var(--space-s);
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.partners-logos {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.partner-logo {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 1000px;
  min-height: 80px;
  background-color: transparent;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: var(--color-gray);
  border-radius: var(--radius-s);
  
  p {
    opacity: 0.7;
  }
}

.error, .loading {
  text-align: center;
  padding: var(--space-xl);
}
</style>