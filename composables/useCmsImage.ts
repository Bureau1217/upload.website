/**
 * Composable pour gérer les URLs d'images du CMS
 */
export const useCmsImage = () => {
  const getCmsImageUrl = (url: string): string => {
    if (!url) return ''

    // Si l'URL contient localhost, la remplacer par le CMS
    if (url.includes('localhost:8000') || url.includes('localhost')) {
      return url.replace(/http:\/\/localhost:?\d*/, 'https://cms.upload-biennale.ch')
    }

    // Si l'URL commence par /, ajouter le domaine CMS
    if (url.startsWith('/')) {
      return `https://cms.upload-biennale.ch${url}`
    }

    // Si l'URL est déjà complète avec le bon domaine, la retourner telle quelle
    return url
  }

  return {
    getCmsImageUrl
  }
}