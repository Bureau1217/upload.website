export const usePageLoading = (minDelayMs: number = 2500, dataRef?: Ref<any>) => {
  const isInitialLoading = ref(true)
  const startTime = Date.now()

  const hideLoader = () => {
    const elapsed = Date.now() - startTime
    const remainingDelay = Math.max(0, minDelayMs - elapsed)

    setTimeout(() => {
      isInitialLoading.value = false
      // Nettoyer les canvas p5 orphelins après fermeture du loader
      setTimeout(() => {
        try {
          const orphanCanvas = document.querySelectorAll('canvas[id^="defaultCanvas"], canvas.p5Canvas')
          orphanCanvas.forEach(canvas => {
            if (canvas && canvas.parentNode) {
              canvas.remove()
            }
          })
        } catch (error) {
          console.warn('Erreur lors du nettoyage des canvas:', error)
        }
      }, 100)
    }, remainingDelay)
  }

  onMounted(() => {
    if (dataRef) {
      // Si on a une ref de données, attendre qu'elles soient chargées
      watch(dataRef, (newData) => {
        if (newData && newData.status === 'ok') {
          // Attendre encore un peu pour les images
          setTimeout(hideLoader, 500)
        }
      }, { immediate: true })
    } else {
      // Sinon, utiliser juste le délai minimum
      setTimeout(hideLoader, 0)
    }
    })

  return {
    isInitialLoading: readonly(isInitialLoading)
  }
}