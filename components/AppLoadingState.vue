<template>
  <div :class="stateClass">
    <h2 v-if="title">{{ title }}</h2>
    <div v-if="type === 'loading'" class="loading-content">
      <div ref="loaderContainer" class="loader-container"></div>
    </div>
    <div v-else>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'

interface Props {
  type: 'loading' | 'error' | 'empty'
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Contenu non disponible'
})

const loaderContainer = ref<HTMLElement>()
let p5Instance: any = null

const stateClass = computed(() => {
  switch (props.type) {
    case 'loading':
      return 'loading-state'
    case 'error':
      return 'error-state'
    case 'empty':
      return 'empty-state'
    default:
      return 'loading-state'
  }
})

onMounted(async () => {
  if (props.type === 'loading') {
    await nextTick()
    // Chargement dynamique de p5.js
    const { default: p5 } = await import('p5')

    // Observer quand le composant devient invisible pour nettoyer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && loaderContainer.value && loaderContainer.value.style.display === 'none') {
          cleanupP5()
        }
      })
    })

    if (loaderContainer.value) {
      observer.observe(loaderContainer.value)
    }
    
    const sketch = (p: any) => {
      let animFont: any = null
      let customText = "       BIENNALE  DE  DESIGN  GRAPHIQUE       "
      let imgs: any[] = []
      let imgOffset = 0
      
      // Variables pour la taille et l'espacement
      let baseLetterSize = 30
      let baseCaseWidth = 28
      let baseCaseHeight = 35
      let scaleFactor = 1
      
      // Canvas - dimensions du container avec ratio correct
      let containerWidth = loaderContainer.value?.clientWidth || window.innerWidth
      let containerHeight = loaderContainer.value?.clientHeight || window.innerHeight
      let canvasWidth = containerWidth
      let canvasHeight = containerHeight
      
      // Variables pour les points et le chemin infini
      let points: any[] = []
      let time = 0
      let infinitePathIndex = 0
      let frameCounter = 0
      let frameInterval = 2 // Réduit de 4 à 2 pour plus de rapidité

      p.setup = async () => {
        if (!loaderContainer.value) return
        
        // Chargement de la police et des images
        try {
          animFont = await p.loadFont("/fonts/Helvetica-Bold.ttf")
          
          // Chargement des images
          const imagePromises = []
          for (let i = 1; i < 24; i++) {
            imagePromises.push(p.loadImage(`/img/images-web${i}.png`))
          }
          imgs = await Promise.all(imagePromises)
        } catch (error) {
          console.warn('Erreur de chargement des assets:', error)
        }
        
        const canvas = p.createCanvas(canvasWidth, canvasHeight)
        canvas.parent(loaderContainer.value)

        // Forcer les dimensions CSS du canvas
        canvas.style('width', '100%')
        canvas.style('height', '100%')
        canvas.style('display', 'block')
        
        p.textFont(animFont)
        imgOffset = p.floor(p.random(imgs.length))
        p.textAlign(p.CENTER, p.CENTER)
        
        // Tailles fixes pour éviter la déformation
        const isMobile = window.innerWidth <= 768
        if (isMobile) {
          baseLetterSize = 32
          baseCaseWidth = 36
          baseCaseHeight = 40
        } else {
          scaleFactor = Math.min(canvasWidth, canvasHeight) / 300
          baseLetterSize = 30 * scaleFactor
          baseCaseWidth = 28 * scaleFactor
          baseCaseHeight = 35 * scaleFactor
        }
      }
      
      p.draw = () => {
        p.background(208)

        time += 0.08 // Augmenté de 0.05 à 0.08 pour plus de vitesse
        frameCounter++

        // Ajouter un nouveau point sur le chemin infini à intervalle régulier
        if (frameCounter >= frameInterval) {
          frameCounter = 0
          addInfinitePoint()
        }

        // Afficher les lettres et images
        for (let i = 0; i < points.length; i++) {
          let charIndex = i % customText.length
          let char = customText[charIndex]

          let currentLetterSize = points[i].letterSize || baseLetterSize
          let currentCaseWidth = points[i].caseWidth || baseCaseWidth
          let currentCaseHeight = points[i].caseHeight || baseCaseHeight

          if (char === " ") {
            if (imgs.length > 0) {
              let img = imgs[(i + imgOffset) % imgs.length]
              p.imageMode(p.CENTER)
              p.image(img, points[i].x, points[i].y, currentCaseWidth, currentCaseHeight)
            }
          } else {
            p.stroke(0)
            p.strokeWeight(1.5)
            p.fill(255)
            p.rect(points[i].x - currentCaseWidth / 2, points[i].y - currentCaseHeight / 2, currentCaseWidth, currentCaseHeight)

            p.noStroke()
            p.fill(0)
            p.textSize(currentLetterSize)
            p.text(char, points[i].x, points[i].y)
          }
        }
      }
      
      const addInfinitePoint = () => {
        // Paramètres du symbole infini (lemniscate)
        const t = time + infinitePathIndex * 0.1
        // Échelle adaptée selon la largeur pour mobile
        const isMobile = window.innerWidth <= 768
        const scale = isMobile ?
          canvasWidth * 0.25 : // Plus large que haut sur mobile
          Math.min(canvasWidth, canvasHeight) * 0.2
        const centerX = canvasWidth / 2
        const centerY = canvasHeight / 2

        // Équation paramétrique du symbole infini
        const x = centerX + (scale * p.cos(t)) / (1 + p.sin(t) * p.sin(t))
        const isMobileY = window.innerWidth <= 768
        const heightFactor = isMobileY ? 0.3 : 0.5
        const y = centerY + (scale * heightFactor * p.sin(t) * p.cos(t)) / (1 + p.sin(t) * p.sin(t))
        
        let newPoint = p.createVector(x, y)
        newPoint.letterSize = baseLetterSize
        newPoint.caseWidth = baseCaseWidth
        newPoint.caseHeight = baseCaseHeight
        points.push(newPoint)
        
        // Limiter le nombre de points affichés
        if (points.length > customText.length) {
          points.splice(0, 1)
        }
        
        infinitePathIndex++
      }
      
      p.windowResized = () => {
        containerWidth = loaderContainer.value?.clientWidth || window.innerWidth
        containerHeight = loaderContainer.value?.clientHeight || window.innerHeight
        canvasWidth = containerWidth
        canvasHeight = containerHeight
        p.resizeCanvas(canvasWidth, canvasHeight)

        // Recalculer les tailles
        const isMobile = window.innerWidth <= 768
        if (isMobile) {
          baseLetterSize = 32
          baseCaseWidth = 36
          baseCaseHeight = 40
        } else {
          scaleFactor = Math.min(canvasWidth, canvasHeight) / 300
          baseLetterSize = 30 * scaleFactor
          baseCaseWidth = 28 * scaleFactor
          baseCaseHeight = 35 * scaleFactor
        }
      }
    }

    p5Instance = new p5(sketch)
  }
})

// Nettoyer p5.js quand le type change ou le composant se démonte
watch(() => props.type, (newType) => {
  if (newType !== 'loading' && p5Instance) {
    cleanupP5()
  }
})

onUnmounted(() => {
  cleanupP5()
})

// Fonction pour nettoyer complètement p5.js
const cleanupP5 = () => {
  try {
    if (p5Instance) {
      p5Instance.remove()
      p5Instance = null
    }

    // Nettoyer aussi le container
    if (loaderContainer.value) {
      loaderContainer.value.innerHTML = ''
    }

    // Supprimer tous les canvas p5 orphelins
    const orphanCanvas = document.querySelectorAll('canvas[id^="defaultCanvas"], canvas.p5Canvas')
    orphanCanvas.forEach(canvas => {
      if (canvas && canvas.parentNode) {
        canvas.remove()
      }
    })
  } catch (error) {
    console.warn('Erreur lors du nettoyage p5.js:', error)
  }
}
</script>

<style lang="scss" scoped>
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: var(--space-xxl);

  h2 {
    margin-bottom: var(--space-m);
    font-size: 1.5rem;
    font-weight: bold;
  }

  div {
    color: #666;
    font-size: 1.1rem;
  }

  // Quand utilisé dans un layout (comme dans main)
  &.loading-state {
    position: relative;
    min-height: 70vh;
    background: var(--color-gray);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader-container {
  width: 100%;
  height: 70vh;
  position: relative;

  @media (max-width: 768px) {
    height: 60vh; // Réduire la hauteur sur mobile
  }
}

.loader-container :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.loading-text {
  color: #666;
  font-size: 1.1rem;
}

.error-state {
  h2, div {
    color: #000; // Noir au lieu de rouge
  }
}

.simple-loader {
  color: #666;
  font-size: 1.1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>