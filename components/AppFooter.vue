<template>
  <footer class="footer">
    <div class="footer__content">
      <!-- Section gauche : Icône social + Contact + Adresse -->
      <div class="footer__left-section">
        <div class="footer__social-contact">
          <!-- Ligne 1: Icône Instagram + Contact -->
          <div class="footer__contact-line" v-if="contactInfo">
            <div class="footer__social" v-if="socialNetworks?.length">
              <a 
                v-for="social in socialNetworks" 
                :key="social.url"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="footer__social-link"
              >
                <span v-html="getSocialIcon(social)"></span>
              </a>
            </div>
            <h4 class="footer__contact" v-html="contactInfo"></h4>
          </div>
          <!-- Ligne 2: Adresse en dessous -->
          <h4 class="footer__address" v-if="addressInfo" v-html="addressInfo"></h4>
        </div>
      </div>

      <!-- Partenaires colonne 2 -->
      <div class="footer__partners-section">
        <div class="footer__partners" v-if="partnerLogos?.length">
          <img 
            v-for="logo in partnerLogos"
            :key="logo.url"
            :src="`http://localhost:8000${logo.url}`"
            :alt="logo.alt || 'Partner logo'"
            class="footer__partner-logo"
            @error="(e) => console.log('Logo failed to load:', logo.url, e)"
          />
        </div>
      </div>

      <!-- Crédits design + dev -->
      <div class="footer__credits-section">
        <h4 class="footer__credit-design" v-if="creditDesign" v-html="creditDesign"></h4>
        <h4 class="footer__credit-dev" v-if="creditDev" v-html="creditDev"></h4>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterData, CMSFetchData } from '~/composables/cms_api'

// Essaie d'abord la page footer, puis fallback vers infos-pratiques
const { data: footerResponse } = await useFetch<CMSFetchData<FooterData>>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: "site.find('footer')",
    select: {
      social_networks: {
        query: "page.social_networks.toStructure()",
        select: {
          icon: {
            query: "structureItem.icon.toFiles.first",
            select: {
              url: true,
              alt: true,
              width: true,
              height: true
            }
          },
          url: "structureItem.url.value"
        }
      },
      footer_contact: true,
      footer_address: true,
      footer_partner_logos: {
        query: "page.footer_partner_logos.toFiles",
        select: {
          url: true,
          alt: true,
          width: true,
          height: true,
          nom_partenaire: true
        }
      },
      footer_credit_design: true,
      footer_credit_dev: true
    }
  }
})

// Fallback vers infos-pratiques si footer n'existe pas
const { data: infosResponse } = await useFetch<CMSFetchData<any>>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: "site.find('infospratiques')",
    select: {
      instagram_url: true,
      contact_email: true,
      partners_logos: {
        query: "page.partners_logos.toFiles",
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

const footerData = computed(() => footerResponse.value?.result || null)
const infosData = computed(() => infosResponse.value?.result || null)

// Utilise les données footer si disponibles, sinon fallback vers infos-pratiques
const socialNetworks = computed(() => {
  if (footerData.value?.social_networks?.length) {
    return footerData.value.social_networks
  }
  // Fallback avec Instagram depuis infos-pratiques
  if (infosData.value?.instagram_url) {
    return [{
      icon: null,
      url: infosData.value.instagram_url
    }]
  }
  return []
})

const contactInfo = computed(() => {
  return footerData.value?.footer_contact || infosData.value?.contact_email || null
})

const addressInfo = computed(() => {
  return footerData.value?.footer_address || null
})

const partnerLogos = computed(() => {
  const logos = footerData.value?.footer_partner_logos || infosData.value?.partners_logos || []
  console.log('Partner logos:', logos)
  return logos
})

const creditDesign = computed(() => {
  return footerData.value?.footer_credit_design || null
})

const creditDev = computed(() => {
  return footerData.value?.footer_credit_dev || null
})

// Debug les données
onMounted(() => {
  console.log('Footer data:', footerData.value)
  console.log('Infos data:', infosData.value)
  console.log('Social networks:', socialNetworks.value)
  console.log('Partner logos:', partnerLogos.value)
  console.log('Partner logos count:', partnerLogos.value?.length)
})

const getSocialIcon = (social: any) => {
  console.log('Social item:', social) // Debug
  // Si on a une icône SVG depuis le CMS
  if (social.icon?.url) {
    return `<img src="http://localhost:8000${social.icon.url}" alt="${social.icon.alt || 'Social icon'}" class="social-svg" />`
  }
  // Fallback avec émoji basé sur l'URL
  if (social.url?.includes('instagram')) {
    return '📷'
  }
  // Autres réseaux sociaux
  if (social.url?.includes('facebook')) return '📘'
  if (social.url?.includes('twitter')) return '🐦'
  if (social.url?.includes('linkedin')) return '💼'
  if (social.url?.includes('youtube')) return '📺'
  if (social.url?.includes('tiktok')) return '🎵'
  // Fallback général
  return '🌐'
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: white;
  border-top: 2px solid black;
  color: black;

  &__content {
    max-width: 1800px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    align-items: center;
  }

  &__left-section {
    grid-column: 1 / 2; // Colonne 1
    justify-self: start;
  }

  &__social-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__contact-line {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  &__partners-section {
    grid-column: 2 / 5; // Colonnes 2-4 (3 colonnes)
    justify-self: start;
  }

  &__credits-section {
    grid-column: 6 / 7; // Colonne 6
    justify-self: start;
  }

  &__social {
    display: flex;
    gap: 1rem;
  }

  &__social-link {
    color: black;
    font-size: 2rem;
    transition: color 0.3s ease;
    text-decoration: none;
    flex-shrink: 0;

    &:hover {
      color: #666;
    }

    :deep(.social-svg) {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
  }

  &__contact {
    line-height: 1.4;
    color: black;
    margin: 0;
  }

  &__address {
    line-height: 1.4;
    color: black;
    margin: 0;
  }

  &__partners {
    display: flex;
    flex-wrap: nowrap;
    gap: 3rem;
    align-items: center;
    justify-content: flex-start;
  }

  &__partner-logo {
    max-height: 50px;
    max-width: 120px;
    object-fit: contain;
  }

  &__credit-design {
    line-height: 1.4;
    color: black;
    margin: 0;
  }

  &__credit-dev {
    line-height: 1.4;
    color: black;
    margin: 0;
  }
}

@media (max-width: 1024px) {
  .footer {
    &__content {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 1.5rem;
      padding: 1rem;
    }

    &__left-section {
      grid-column: 1;
      grid-row: 1;
      justify-self: start;
    }

    &__credits-section {
      grid-column: 2;
      grid-row: 1;
      justify-self: start;
    }

    &__partners-section {
      grid-column: 1 / 3;
      grid-row: 2;
      justify-self: stretch;
      width: 100%;
    }

    &__social-contact {
      flex-direction: column;
      gap: 0.5rem;
    }

    &__contact,
    &__address,
    &__credit-design,
    &__credit-dev {
      text-align: left;
    }

    &__partners {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.5rem;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      padding: 0;
    }

    &__partner-logo {
      flex: 1;
      width: calc(25% - 0.375rem);
      max-width: none;
      max-height: 40px;
      object-fit: contain;
    }
  }
}

@media (max-width: 768px) {
  .footer {
    margin-top: 3rem;
    
    &__partner-logo {
      max-height: 55px;
      max-width: 80px;
    }
  }
}
</style>