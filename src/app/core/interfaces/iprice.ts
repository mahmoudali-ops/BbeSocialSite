export interface IPrice {
    id: number
    imageCover: string
    referneceName: any
    metaDescription: any
    metaKeyWords: any
    priceTranlationDtos: IPriceTranlation[]
  }
  export interface IPriceTranlation {
    id: number
    language: string
    discount: number
    title: string
    description: string
    priceService: number
    includeFirst: string
    includeSecond: string
    includeThird: string
    includeForth: string
  }