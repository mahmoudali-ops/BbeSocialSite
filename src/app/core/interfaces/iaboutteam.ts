export interface IAboutTeam {
  id: number
  imageCover: string
  aboutTeamTranlationDtos: AboutTeamTranlation[]
}

export interface AboutTeamTranlation{
  id: number
  language: string
  name: string
  position: string
  description: string
}
