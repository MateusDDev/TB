export interface IMatch {
  id: number,
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface INewMatch {
  homeTeamId: number,
  awayTeamId: number,
  homeTeamGoals: number,
  awayTeamGoals: number
}
