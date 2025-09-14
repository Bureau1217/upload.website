<template>
  <div ref="heroContainer" class="hero-container">
    <div id="biennale-container" class="biennale-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const heroContainer = ref<HTMLElement>()

let p5Instance: any = null
let animFont: any = null
let customText = "       BIENNALE  DE  DESIGN  GRAPHIQUE       "
let imgs: any[] = []
let imgOffset = 0

// Variables pour la taille et l'espacement (augmentées)
let baseLetterSpacing = 25 // Augmenté de 17 à 25
let scaledLetterSpacing = 20 // Augmenté de 15 à 20
let baseLetterSize = 30 // Augmenté de 20 à 30
let baseCaseWidth = 28 // Augmenté de 18 à 28
let baseCaseHeight = 35 // Augmenté de 25 à 35
let sizeMultiplier = 1
let scaleFactor: number

// Canvas et marges
let biennaleCanvas: any
let canvasWidth: number, canvasHeight: number
let canvasMarginRatioX = -0.15
let canvasMarginRatioY = -0.15

// Variables pour les points
let points: any[] = []
let idlePath: any[] = []
let isIdleMode = false
let idleIndex = 0
let idleFrameCounter = 0
let idleInterval = 6

// Paramètres organiques
let pathSeed = 0
let pathTime = 0
let fieldScale = 0.0016
let turnStrength = 0.45
let stepJitter = 0.25
let wallDamping = 0.85

// Comportement souris
let lastMouseMoveTime = 0
let isMouseOutside = false
let idleDelay = 1000

onMounted(async () => {
  await nextTick()
  // Chargement dynamique de p5.js
  const { default: p5 } = await import('p5')
  
  const sketch = (p: any) => {
    p.setup = async () => {
      // Chargement de la police et des images avec async/await
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
        // Continuer sans les assets si erreur
      }
      calculateCanvasSize()
      
      // Vérifier que l'élément container existe avant de créer le canvas
      const container = document.getElementById('biennale-container')
      if (!container) {
        console.warn('Container biennale-container not found')
        return
      }
      
      biennaleCanvas = p.createCanvas(canvasWidth, canvasHeight)
      biennaleCanvas.id('biennale-canvas')
      biennaleCanvas.parent('biennale-container')
      biennaleCanvas.style('display', 'block')
      biennaleCanvas.style('touch-action', 'none')

      p.textFont(animFont)
      imgOffset = p.floor(p.random(imgs.length))
      p.textAlign(p.CENTER, p.CENTER)

      // Event listeners
      biennaleCanvas.elt.addEventListener('touchstart', preventDefault, { passive: false })
      biennaleCanvas.elt.addEventListener('touchmove', preventDefault, { passive: false })

      biennaleCanvas.mouseOver(() => {
        isMouseOutside = false
        isIdleMode = false
      })

      biennaleCanvas.mouseOut(() => {
        isMouseOutside = true
        isIdleMode = true
        idlePath = []
        idleIndex = 0
        generateIdlePath()
      })

      pathSeed = p.floor(p.random(100000))
      lastMouseMoveTime = p.millis()
    }

    const preventDefault = (e: Event) => {
      e.preventDefault()
    }

    const calculateCanvasSize = () => {
      const container = document.getElementById("biennale-container")
      if (!container) {
        console.warn('Container not found in calculateCanvasSize')
        // Valeurs par défaut
        canvasWidth = 800
        canvasHeight = 600
        scaleFactor = 1
        scaledLetterSpacing = baseLetterSpacing
        baseLetterSize = 30
        baseCaseWidth = 28
        baseCaseHeight = 35
        return
      }
      
      const rect = container.getBoundingClientRect()
      canvasWidth = rect.width || 800
      canvasHeight = rect.height || 600

      if (isTouchDevice()) {
        scaleFactor = canvasHeight / 400  // Réduit de 500 à 400 pour agrandir les blocs
      } else {
        scaleFactor = canvasWidth / 500
      }

      scaledLetterSpacing = baseLetterSpacing * scaleFactor
      // Augmenter encore plus la taille sur mobile
      if (isTouchDevice()) {
        baseLetterSize = 35 * scaleFactor  // Augmenté de 30 à 35
        baseCaseWidth = 32 * scaleFactor   // Augmenté de 28 à 32
        baseCaseHeight = 40 * scaleFactor  // Augmenté de 35 à 40
      } else {
        baseLetterSize = 30 * scaleFactor
        baseCaseWidth = 28 * scaleFactor
        baseCaseHeight = 35 * scaleFactor
      }
    }

    p.windowResized = () => {
      calculateCanvasSize()
      p.resizeCanvas(canvasWidth, canvasHeight)
      if (isIdleMode) {
        idlePath = []
        idleIndex = 0
        generateIdlePath()
      }
    }

    p.draw = () => {
      p.background(208)

      if (!isMouseOutside && p.millis() - lastMouseMoveTime > idleDelay && !isIdleMode) {
        isIdleMode = true
        idlePath = []
        idleIndex = 0
        generateIdlePath()
      }

      if (isIdleMode) {
        followIdlePath()
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

    const followIdlePath = () => {
      if (idlePath.length === 0) return

      idleFrameCounter++
      if (idleFrameCounter >= idleInterval) {
        idleFrameCounter = 0

        if (idleIndex < idlePath.length) {
          let point = idlePath[idleIndex]
          addPoint(point.x, point.y)
          idleIndex++
        } else if (idleIndex >= idlePath.length) {
          generateIdlePath()
          if (idlePath.length > 0) {
            let point = idlePath[idleIndex]
            addPoint(point.x, point.y)
            idleIndex++
          }
        }
      }
    }

    const generateIdlePath = () => {
      let x: number, y: number
      const marginX = canvasWidth * canvasMarginRatioX
      const marginY = canvasHeight * canvasMarginRatioY

      if (idlePath.length > 0 && idleIndex >= idlePath.length) {
        const last = idlePath[idlePath.length - 1]
        x = last.x
        y = last.y
      } else if (points.length > 0) {
        x = points[points.length - 1].x
        y = points[points.length - 1].y
      } else {
        x = p.random(marginX, canvasWidth - marginX)
        y = p.random(marginY, canvasHeight - marginY)
      }

      let angle = p.noise(pathSeed * 0.13, x * fieldScale, y * fieldScale) * p.TWO_PI
      let stepBase = scaledLetterSpacing

      const n = p.floor(customText.length * 1.5)
      idlePath = []

      for (let i = 0; i < n; i++) {
        const nx = (x + pathSeed) * fieldScale
        const ny = (y - pathSeed) * fieldScale
        const nt = (pathTime + i * 0.012)

        const turn = (p.noise(nx, ny, nt) - 0.5) * 2.0
        angle += turn * turnStrength

        const jitter = 1.0 + (p.noise(nx * 2.3, ny * 2.3, nt * 0.7) - 0.5) * 2.0 * stepJitter
        const step = stepBase * jitter

        let dx = p.cos(angle) * step
        let dy = p.sin(angle) * step
        x += dx
        y += dy

        let bounced = false

        if (x <= marginX) {
          x = marginX + (marginX - x) * (1 - wallDamping)
          angle = p.PI - angle
          bounced = true
        } else if (x >= canvasWidth - marginX) {
          x = (canvasWidth - marginX) - (x - (canvasWidth - marginX)) * (1 - wallDamping)
          angle = p.PI - angle
          bounced = true
        }
        if (y <= marginY) {
          y = marginY + (marginY - y) * (1 - wallDamping)
          angle = -angle
          bounced = true
        } else if (y >= canvasHeight - marginY) {
          y = (canvasHeight - marginY) - (y - (canvasHeight - marginY)) * (1 - wallDamping)
          angle = -angle
          bounced = true
        }

        if (bounced) {
          angle += p.random(-0.25, 0.25)
        }

        idlePath.push(p.createVector(x, y))
      }

      pathTime += 0.5
      idleIndex = 0
    }

    const addPoint = (x: number, y: number) => {
      let newPoint = p.createVector(x, y)
      newPoint.letterSize = baseLetterSize * sizeMultiplier
      newPoint.caseWidth = baseCaseWidth * sizeMultiplier
      newPoint.caseHeight = baseCaseHeight * sizeMultiplier
      points.push(newPoint)

      if (points.length > customText.length) {
        points.splice(0, 1)
      }
    }

    p.touchMoved = () => {
      if (p.touches.length > 0) {
        lastMouseMoveTime = p.millis()
        if (isIdleMode) isIdleMode = false

        const last = points[points.length - 1]
        const tx = p.touches[0].x, ty = p.touches[0].y
        if (!last || p.dist(tx, ty, last.x, last.y) >= scaledLetterSpacing) {
          addPoint(tx, ty)
        }
      }
      return false
    }

    p.mouseMoved = () => {
      if (!isMouseOutside && !isTouchDevice()) {
        lastMouseMoveTime = p.millis()
        if (isIdleMode) {
          isIdleMode = false
        }
        const last = points[points.length - 1]
        if (!last || p.dist(p.mouseX, p.mouseY, last.x, last.y) >= scaledLetterSpacing) {
          addPoint(p.mouseX, p.mouseY)
        }
      }
    }

    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints
    }
  }

  p5Instance = new p5(sketch)
})

onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style lang="scss" scoped>
.hero-container {
  width: 100%;
  height: 90vh;
  position: relative;
}

.biennale-container {
  width: 100%;
  height: 100%;
  position: relative;
}

:deep(#biennale-canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>