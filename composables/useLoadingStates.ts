export const useLoadingStates = () => {
  return {
    getLoadingTemplate: () => `<div class="loading-state">Chargement...</div>`,
    getErrorTemplate: (message = 'Erreur de chargement') => `<div class="error-state">${message}</div>`,
    getEmptyTemplate: (message = 'Aucun contenu disponible') => `<div class="empty-state">${message}</div>`
  }
}