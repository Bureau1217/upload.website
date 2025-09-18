/**
 * Composable pour gérer les URLs d'images du CMS
 */
export const useCmsImage = () => {
  const config = useRuntimeConfig()
  const cmsUrl = config.public.kirbyUrl || 'https://cms.upload-biennale.ch'

  const getCmsImageUrl = (url: string): string => {
    if (!url) return ''

    // Si l'URL commence par /, ajouter le domaine CMS
    if (url.startsWith('/')) {
      return `${cmsUrl}${url}`
    }

    // Si l'URL est déjà complète, la retourner telle quelle
    return url
  }

  return {
    getCmsImageUrl
  }
}