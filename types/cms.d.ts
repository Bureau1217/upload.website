// Types pour l'API CMS basés sur les blueprints Kirby

export interface CMS_API_Response {
  status: 'ok' | 'error'
  message?: string
}

export interface CMS_API_Image {
  extension: string
  filename: string
  height: number
  id: string
  mime: string
  niceSize: string
  template: string
  type: "image"
  url: string
  width: number
}

export interface CMS_API_ImageObject {
  alt: string | null
  tiny: CMS_API_Image
  small: CMS_API_Image
  reg: CMS_API_Image
  large: CMS_API_Image
  xxl: CMS_API_Image
}

export interface CMS_API_PartialImageObject {
  alt: string | null
  tiny?: CMS_API_Image
  small?: CMS_API_Image
  reg?: CMS_API_Image
  large?: CMS_API_Image
  xxl?: CMS_API_Image
}

export interface CMS_API_SimpleImage {
  alt: string | null
  url: string
  width: number
  height: number
}

export interface CMS_API_Evenement {
  title: string
  slug: string
  date: string
  time: string
  address: string
  googlemaps: string
  description: string
  conditions: string
}

export interface CMS_API_Participant {
  title: string
  slug: string
  content_subtitle: string
  content_body: string
  content_descriptif: string
  info_bio_studio: string
  info_link_website: string
  info_link_social: string
  info_image: CMS_API_ImageObject[]
}

export interface CMS_API_Home {
  title: string
  slug: string
  intro: string
}

export interface CMS_API_Programme {
  title: string
  slug: string
  // Ajouter les champs spécifiques au programme selon tes besoins
}

export interface CMS_API_Exposants {
  title: string
  slug: string
  // Ajouter les champs spécifiques aux exposants selon tes besoins
}