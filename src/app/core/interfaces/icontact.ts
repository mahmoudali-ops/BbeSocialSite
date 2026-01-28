export interface IContact {
  id: number
  imageCover: string
  referneceName: string
  metaDescription: string
  metaKeyWords: string
  contactTranlationDtos: ContactTranlation[]
}

export interface ContactTranlation {
  id: number
  language: string
  title: string
  description: string
}
