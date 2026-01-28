export interface ICareer {
    id: number
    imageCover: string
    careerCardTranslationsDto: CareerCardTranslation[]
  }
  
  export interface CareerCardTranslation{
    id: number
    language: string
    jobTitle: string
    employmentType: string
    salaryFrom: number
    salaryTo: number
    salaryPeriod: string
    description: string
    createdAt: string
    updatedAt: string
  }
  