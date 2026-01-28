export interface IServiceFeature {
    id: number
    imageCover: string
    servicesFeatureTranslationDtos: ServicesFeatureTranslation[]
  }
  
  export interface ServicesFeatureTranslation{
    id: number
    title: string
    language: string
    description: string
    includeFirst: string
    includeSecond: string
  }
  