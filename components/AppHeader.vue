<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo (à gauche, plus petit) -->
      <NuxtLink to="/" class="logo-link">
        <img src="/img/Logo_Upload-Web.svg" alt="Upload Logo" class="logo" />
      </NuxtLink>
      
      <!-- Bloc texte de la biennale (au centre, 3 lignes en h4) -->
      <div class="biennale-info">
        <h4>Biennale de design graphique</h4>
        <h4>Plan-les-Ouates x HEAD – Genève</h4>
        <h4>4.10 – 7.11.2025</h4>
      </div>
      
      <!-- Bouton menu burger (mobile seulement) -->
      <button class="menu-burger" :class="{ 'mobile-open': isMobileMenuOpen }" @click="toggleMobileMenu" aria-label="Menu">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>

      <!-- Navigation (à droite) -->
      <nav class="main-navigation" :class="{ 'mobile-open': isMobileMenuOpen }">
        <h3><NuxtLink to="/exposants" class="nav-link nav-wave" data-nav="0" @click="closeMobileMenu">Exposants</NuxtLink></h3>
        <h3><NuxtLink to="/programme" class="nav-link nav-wave" data-nav="1" @click="closeMobileMenu">Programme</NuxtLink></h3>
        <h3><NuxtLink to="/apropos" class="nav-link nav-wave" data-nav="2" @click="closeMobileMenu">À propos</NuxtLink></h3>
        <h3><NuxtLink to="/infos-pratiques" class="nav-link nav-wave" data-nav="3" @click="closeMobileMenu">Infos pratiques</NuxtLink></h3>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'

let navChars: HTMLElement[][] = [[], [], [], []]
let navLinks: NodeListOf<HTMLElement> | null = null

// Menu mobile
const isMobileMenuOpen = ref(false)
const route = useRoute()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Désactiver/réactiver le scroll du body
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  // Réactiver le scroll du body
  document.body.style.overflow = ''
}

const distortNav = (linkIndex: number, isActive = false) => {
  if (!navChars[linkIndex] || navChars[linkIndex].length === 0) return
  
  navChars[linkIndex].forEach((char) => {
    if (char.classList.contains('space')) return
    
    const randomY = (Math.random() * 20 - 10).toFixed(1) // Mouvement vertical seulement
    
    char.style.transform = `translateY(${randomY}px)`
    char.style.transition = isActive ? 'transform 0.1s ease' : 'transform 0.2s ease'
  })
}

const resetNav = (linkIndex: number, link: HTMLElement) => {
  if (!navChars[linkIndex] || navChars[linkIndex].length === 0) return
  
  // Ne pas remettre en place si le lien est actif
  if (link.classList.contains('router-link-active')) return
  
  navChars[linkIndex].forEach((char) => {
    char.style.transform = 'translateY(0px) rotate(0deg)'
    char.style.transition = 'transform 0.3s ease'
  })
}

const updateActiveStates = () => {
  if (!navLinks) return
  
  navLinks.forEach((link, index) => {
    if (link.classList.contains('router-link-active')) {
      // Lien actif : appliquer l'effet
      distortNav(index, true)
    } else {
      // Lien inactif : remettre normal
      if (navChars[index]) {
        navChars[index].forEach((char) => {
          char.style.transform = 'translateY(0px) rotate(0deg)'
          char.style.transition = 'transform 0.3s ease'
        })
      }
    }
  })
}

onMounted(() => {
  nextTick(() => {
    // Utiliser des sélecteurs DOM uniquement dans le header pour éviter les conflits
    const headerElement = document.querySelector('.app-header')
    if (!headerElement) return
    
    navLinks = headerElement.querySelectorAll('.nav-wave[data-nav]') as NodeListOf<HTMLElement>
    
    navLinks.forEach((link, index) => {
      if (!link) {
        console.warn(`Navigation link ${index} not found`)
        return
      }
      
      const originalText = link.textContent || ''
      if (!originalText) {
        console.warn(`Navigation link ${index} has no text content`)
        return
      }
      
      // Créer les spans pour chaque lettre
      link.innerHTML = originalText
        .split('')
        .map((char) => {
          if (char === ' ') {
            return `<span class="nav-char space">&nbsp;</span>`
          }
          return `<span class="nav-char">${char}</span>`
        })
        .join('')
      
      // Récupérer tous les caractères pour ce lien
      navChars[index] = Array.from(link.querySelectorAll('.nav-char'))
      
      // Ajouter les event listeners directement
      link.addEventListener('mouseenter', () => {
        const isActive = link.classList.contains('router-link-active')
        distortNav(index, isActive)
      })
      link.addEventListener('mouseleave', () => resetNav(index, link))
      
      // Si le lien est actif dès le début, appliquer l'effet
      if (link.classList.contains('router-link-active')) {
        distortNav(index, true)
      }
    })
    
    // Surveiller les changements de route pour mettre à jour les états actifs
    watch(() => route.path, () => {
      nextTick(() => {
        updateActiveStates()
      })
    }, { immediate: false })
  })
})

// Nettoyer le scroll au démontage du composant
onUnmounted(() => {
  document.body.style.overflow = ''
})

</script>


<style lang="scss" scoped>
.app-header {
  background-color: white;
  border-bottom: 2px solid black;
  position: sticky;
  top: 0;
  z-index: 1001;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1800px;
  margin: 0 auto;
}

.logo-link {
  flex-shrink: 0;
}

.logo {
  height: 43px;
  width: auto;
}

.biennale-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  
  // Les h4 héritent automatiquement des styles du main.scss
  h4 {
    margin: 0;
  }
}

.main-navigation {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
  
  h3 {
    margin: 0;
    font-family: 'Helvetica', Arial, sans-serif;
    font-weight: bold;
    font-size: clamp(1.3rem, 5vw, 1.2rem);
    line-height: 1.3;
    color: black;
  }
}

.nav-link {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
  
  // Si lien actif, style plus prononcé
  &.router-link-active {
    font-weight: bold;
  }
}

.main-navigation .nav-wave {
  :deep(.nav-char) {
    display: inline-block;
    position: relative;
    transition: transform 0.3s ease;
    margin-right: 0.05em; /* Petit espacement entre les lettres */
    font-family: 'Helvetica', Arial, sans-serif;
    font-weight: bold;
    font-size: clamp(1.3rem, 5vw, 1.2rem);
    line-height: 1.3;
    color: black;
    
    &.space {
      width: 0.3em;
      margin-right: 0;
    }
    
    &:last-child {
      margin-right: 0;
    }
  }
}

/* Menu burger - caché sur desktop */
.menu-burger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  .burger-line {
    width: 100%;
    height: 3px;
    background-color: var(--color-black);
    transition: all 0.3s ease;
    transform-origin: center;
  }
  
  &.mobile-open {
    .burger-line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    .burger-line:nth-child(2) {
      opacity: 0;
    }
    
    .burger-line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .biennale-info {
    margin-left: 1rem;
    text-align: center;
  }
  
  .main-navigation {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .app-header {
    position: relative;
  }
  
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
  
  .logo {
    height: 25px;
  }
  
  .biennale-info {
    display: none;
  }
  
  .menu-burger {
    display: flex;
  }
  
  .main-navigation {
    position: fixed;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-gray);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--space-l);
    padding: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    
    h3 {
      padding: 0;
      border-bottom: none;
      font-size: 1.8rem;
      text-align: left;
      width: 100%;
      
      .nav-link {
        font-size: 1.8rem;
        text-align: left;
        display: block;
        width: 100%;
      }
    }
    
    .nav-wave :deep(.nav-char) {
      font-size: 1.8rem !important;
    }
    
    &.mobile-open {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>