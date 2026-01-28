export interface IAbout {
    id: number
    imageCover: string
    referneceName: string
    metaDescription: string
    metaKeyWords: string
    aboutTranslationDtos: AboutTranslation[]
  }
  
  export interface AboutTranslation{
    id: number
    title: string
    language: string
    description: string
  }