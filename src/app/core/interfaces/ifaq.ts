export interface IFaq {
    id: number
    imageCover: string
    referneceName: string
    metaDescription: string
    metaKeyWords: string
    fAQsTranslationDTos: FAqsTranslation[]
  }
  
  export interface FAqsTranslation{
    id: number
    language: string
    question: string
    answer: string
  }
