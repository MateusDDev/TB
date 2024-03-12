import { ServiceResponse } from '../interfaces/ServiceResponse';
import MatchModel from '../models/MatchModel';
import { ILeaderboard, ITeamIdentifier } from '../interfaces/leaderboard/ILeaderboard';
import { IMatchWithAssociations } from '../interfaces/matches/IMatch';

export default class LeaderboardService {
  constructor(
    private matchModel = new MatchModel(),
  ) {}

  private static teamIdentifier(isHomeTeam: boolean, match: IMatchWithAssociations):
  ITeamIdentifier {
    if (isHomeTeam) {
      return {
        teamId: match.homeTeamId,
        matchResult: LeaderboardService.matchResult(match.homeTeamGoals, match.awayTeamGoals),
      };
    }
    return {
      teamId: match.awayTeamId,
      matchResult: LeaderboardService.matchResult(match.awayTeamGoals, match.homeTeamGoals),
    };
  }

  private static matchResult(goalsFavor: number, goalsOwn: number): number {
    if (goalsFavor > goalsOwn) return 3;
    if (goalsFavor === goalsOwn) return 1;
    return 0;
  }

  private static teamPerformance(totalPoints: number, totalMatches: number): number {
    const calc = (totalPoints / (totalMatches * 3)) * 100;
    return Number(calc.toFixed(2));
  }

  private static goalDifference(scored: number, conceded: number): number {
    return scored - conceded;
  }

  private static async getTotalPoints(
    teamId: number,
    isHomeTeam: boolean,
    matches: IMatchWithAssociations[],
  ): Promise<number> {
    const results: number[] = matches.filter(
      (match) => LeaderboardService.teamIdentifier(isHomeTeam, match).teamId === teamId,
    )
      .map((m) => LeaderboardService.teamIdentifier(isHomeTeam, m).matchResult);

    return results.reduce((acc, value) => acc + value, 0);
  }

  private static async getTotalGames(
    teamId: number,
    isHomeTeam: boolean,
    matches: IMatchWithAssociations[],
  ): Promise<number> {
    return matches.filter(
      (match) => LeaderboardService.teamIdentifier(isHomeTeam, match).teamId === teamId,
    ).length;
  }

  private static async getMatchResults(
    teamId: number,
    resultType: 3 | 0 | 1,
    isHomeTeam: boolean,
    matches: IMatchWithAssociations[],
  ): Promise<number> {
    const victories: number[] = matches.filter(
      (match) => LeaderboardService.teamIdentifier(isHomeTeam, match).teamId === teamId,
    ).map((m) => {
      const { matchResult } = LeaderboardService.teamIdentifier(isHomeTeam, m);

      if (matchResult === resultType) return 1;
      return 0;
    });

    return victories.reduce((acc, value) => acc + value, 0);
  }

  private static async getTeamGoals(
    teamId: number,
    isFavor: boolean,
    isHomeTeam: boolean,
    matches: IMatchWithAssociations[],
  ): Promise<number> {
    const goals = matches.filter(
      (match) => LeaderboardService.teamIdentifier(isHomeTeam, match).teamId === teamId,
    )
      .map((m) => {
        if (isHomeTeam) {
          return isFavor ? m.homeTeamGoals : m.awayTeamGoals;
        }
        return isFavor ? m.awayTeamGoals : m.homeTeamGoals;
      });

    return goals.reduce((acc, value) => acc + value, 0);
  }

  private static async buildBoard(
    teamId: number,
    teamName: string,
    isHomeTeam: boolean,
    matches: IMatchWithAssociations[],
  ): Promise<Omit<ILeaderboard, 'goalsBalance' | 'efficiency'>> {
    return {
      name: teamName,
      totalPoints: await LeaderboardService.getTotalPoints(teamId, isHomeTeam, matches),
      totalGames: await LeaderboardService.getTotalGames(teamId, isHomeTeam, matches),
      totalVictories: await LeaderboardService.getMatchResults(teamId, 3, isHomeTeam, matches),
      totalDraws: await LeaderboardService.getMatchResults(teamId, 1, isHomeTeam, matches),
      totalLosses: await LeaderboardService.getMatchResults(teamId, 0, isHomeTeam, matches),
      goalsFavor: await LeaderboardService.getTeamGoals(teamId, true, isHomeTeam, matches),
      goalsOwn: await LeaderboardService.getTeamGoals(teamId, false, isHomeTeam, matches),
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

  async getLeaderboard(isHomeTeam: boolean): Promise<ServiceResponse<ILeaderboard[]>> {
    const matches = await this.matchModel.findAllByStatus('false');

    const boardPromises = matches.map(async ({ homeTeamId, awayTeamId, homeTeam, awayTeam }) => {
      const build = await LeaderboardService.buildBoard(
        isHomeTeam ? homeTeamId : awayTeamId,
        isHomeTeam ? homeTeam.teamName : awayTeam.teamName,
        isHomeTeam,
        matches,
      );

      const board: ILeaderboard = { ...build,
        goalsBalance: LeaderboardService.goalDifference(build.goalsFavor, build.goalsOwn),
        efficiency: LeaderboardService.teamPerformance(build.totalPoints, build.totalGames) };

      return board;
    });

    const board = await Promise.all(boardPromises);
    const uniqueTeams = LeaderboardService.getUniqueTeams(board);
    const orderedBoard = LeaderboardService.orderLeaderboard(uniqueTeams);
    return { status: 'SUCCESSFUL', data: orderedBoard };
  }

  private static buildDefaultLeaderboard(homeItem: ILeaderboard, awayItem: ILeaderboard):
  Omit<ILeaderboard, 'goalsBalance' | 'efficiency'> {
    return {
      name: homeItem.name,
      totalPoints: homeItem.totalPoints + awayItem.totalPoints,
      totalGames: homeItem.totalGames + awayItem.totalGames,
      totalVictories: homeItem.totalVictories + awayItem.totalVictories,
      totalDraws: homeItem.totalDraws + awayItem.totalDraws,
      totalLosses: homeItem.totalLosses + awayItem.totalLosses,
      goalsFavor: homeItem.goalsFavor + awayItem.goalsFavor,
      goalsOwn: homeItem.goalsOwn + awayItem.goalsOwn,
    };
  }

  async getDefaultLeadboard(): Promise<ServiceResponse<ILeaderboard[]>> {
    const homeLeaderboard = (await this.getLeaderboard(true)).data as ILeaderboard[];
    const awayLeaderboard = (await this.getLeaderboard(false)).data as ILeaderboard[];

    const leaderboard: ILeaderboard[] = [];

    for (let i = 0; i < homeLeaderboard.length; i += 1) {
      const homeItem = homeLeaderboard[i];
      const awayItem = awayLeaderboard.find((item) => item.name === homeItem.name);

      if (awayItem) {
        const build = LeaderboardService.buildDefaultLeaderboard(homeItem, awayItem);
        const board: ILeaderboard = {
          ...build,
          goalsBalance: LeaderboardService.goalDifference(build.goalsFavor, build.goalsOwn),
          efficiency: LeaderboardService.teamPerformance(build.totalPoints, build.totalGames),
        };
        leaderboard.push(board);
      }
    }

    const orderedBoard = LeaderboardService.orderLeaderboard(leaderboard);
    return { status: 'SUCCESSFUL', data: orderedBoard };
  }
}
