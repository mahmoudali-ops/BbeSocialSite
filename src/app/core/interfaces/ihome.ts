export interface IHome {
    id: number
    mainCover: string
    multiLangImage: string
    teamImage: string
    helpImage: string
    homeTranslationDtos: HomeTranslation[]
  }
  
  export interface HomeTranslation {
    id: number
    language: string
    title: string
    description: string
  }
  