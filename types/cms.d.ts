// Types pour l'API CMS basés sur les blueprints Kirby

export interface CMS_API_Response {
  status: 'ok' | 'error'
  message?: string
}

export interface CMS_API_File {
  alt: string
  tiny: string
  small: string
  reg: string
  large: string
  xxl: string
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
  info_image: CMS_API_File[]
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