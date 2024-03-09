import { ServiceResponse } from '../interfaces/ServiceResponse';
import MatchModel from '../models/MatchModel';
import { ILeaderboard } from '../interfaces/leaderboard/ILeaderboard';

export default class LeaderboardService {
  constructor(
    private matchModel = new MatchModel(),
  ) {}

  private static matchResult(homeGoals: number, awayGoals: number): number {
    if (homeGoals > awayGoals) return 3;
    if (homeGoals === awayGoals) return 1;
    return 0;
  }

  private static teamPerformance(totalPoints: number, totalMatches: number): number {
    const calc = (totalPoints / (totalMatches * 3)) * 100;
    return Number(calc.toFixed(2));
  }

  private static goalDifference(scored: number, conceded: number): number {
    return scored - conceded;
  }

  private async getTotalPoints(teamId: number): Promise<number> {
    const matches = await this.matchModel.findAllByStatus('false');

    const results = matches.filter((match) => match.homeTeamId === teamId)
      .map((m) => LeaderboardService.matchResult(m.homeTeamGoals, m.awayTeamGoals));

    return results.reduce((acc, value) => acc + value, 0);
  }

  private async getTotalGames(teamId: number): Promise<number> {
    const matches = await this.matchModel.findAllByStatus('false');

    return matches.filter((match) => match.homeTeamId === teamId).length;
  }

  private async getMatchResults(teamId: number, resultType: 3 | 0 | 1): Promise<number> {
    const matches = await this.matchModel.findAllByStatus('false');

    const victories: number[] = matches.filter((match) => match.homeTeamId === teamId).map((m) => {
      const result = LeaderboardService.matchResult(m.homeTeamGoals, m.awayTeamGoals);

      if (result === resultType) return 1;
      return 0;
    });

    return victories.reduce((acc, value) => acc + value, 0);
  }

  private async getTeamGoals(teamId: number, isFavor: boolean): Promise<number> {
    const matches = await this.matchModel.findAllByStatus('false');

    const goals = matches.filter((match) => match.homeTeamId === teamId)
      .map((m) => (isFavor ? m.homeTeamGoals : m.awayTeamGoals));

    return goals.reduce((acc, value) => acc + value, 0);
  }

  private async buildBoard(homeTeamId: number, homeTeamName: string):
  Promise<Omit<ILeaderboard, 'goalsBalance' | 'efficiency'>> {
    const totalPoints = await this.getTotalPoints(homeTeamId);
    const totalGames = await this.getTotalGames(homeTeamId);
    const totalVictories = await this.getMatchResults(homeTeamId, 3);
    const totalDraws = await this.getMatchResults(homeTeamId, 1);
    const totalLosses = await this.getMatchResults(homeTeamId, 0);
    const goalsFavor = await this.getTeamGoals(homeTeamId, true);
    const goalsOwn = await this.getTeamGoals(homeTeamId, false);

    return {
      name: homeTeamName,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
    };
  }

  private static orderLeaderboard(board: ILeaderboard[]): ILeaderboard[] {
    return board.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;

      if (b.totalVictories !== a.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });
  }

  private static getUniqueTeams(leaderboard: ILeaderboard[]): ILeaderboard[] {
    const names = leaderboard.map((item) => item.name);

    const uniqueNames = names.filter((name, index) => names.indexOf(name) === index);

    return uniqueNames.reduce((uniqueLeaderboard: ILeaderboard[], name: string) => {
      const uniqueItem = leaderboard.find((item) => item.name === name);
      if (uniqueItem) uniqueLeaderboard.push(uniqueItem);
      return uniqueLeaderboard;
    }, []);
  }

  async getLeaderboard(): Promise<ServiceResponse<ILeaderboard[]>> {
    const matches = await this.matchModel.findAllByStatus('false');

    const boardPromises = matches.map(async ({ homeTeamId, homeTeam }) => {
      const build = await this.buildBoard(homeTeamId, homeTeam.teamName);

      const board: ILeaderboard = {
        ...build,
        goalsBalance: LeaderboardService.goalDifference(build.goalsFavor, build.goalsOwn),
        efficiency: LeaderboardService.teamPerformance(build.totalPoints, build.totalGames),
      };

      return board;
    });

    const board = await Promise.all(boardPromises);
    const uniqueTeams = LeaderboardService.getUniqueTeams(board);
    const orderedBoard = LeaderboardService.orderLeaderboard(uniqueTeams);
    return {
      status: 'SUCCESSFUL',
      data: orderedBoard,
    };
  }
}
