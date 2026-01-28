export interface IServiceCore {
    id: number
    imageCover: string
    serviceCoreTranlationDtos: ServiceCoreTranlation[]
  }
  
  export interface ServiceCoreTranlation{
    id: number
    language: string
    title: string
    description: string
  }
  