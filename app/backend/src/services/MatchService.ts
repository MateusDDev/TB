import { INewEntity } from '../interfaces/INewEntity';
import { MessageType, ServiceResponse } from '../interfaces/ServiceResponse';
import { IMatch, INewMatch } from '../interfaces/matches/IMatch';
import MatchModel from '../models/MacthModel';
import Schemas from './validations/Schemas';
import TeamService from './TeamService';

export default class MatchService {
  constructor(
    private teamService = new TeamService(),
    private matchModel = new MatchModel(),
    private schema = new Schemas(),
  ) {}

  async findAll(): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll();

    return {
      status: 'SUCCESSFUL',
      data: matches,
    };
  }

  async findAllByStatus(status: 'true' | 'false'): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAllByStatus(status);

    if (!matches) {
      return {
        status: 'NOT_FOUND',
        data: { message: 'Match not found' },
      };
    }

    return {
      status: 'SUCCESSFUL',
      data: matches,
    };
  }

  async endMatch(id: number): Promise<ServiceResponse<MessageType>> {
    const match = await this.matchModel.update(id, { inProgress: false });
    if (!match) {
      return {
        status: 'BAD_REQUEST',
        data: { message: 'Match already ended' },
      };
    }

    return {
      status: 'SUCCESSFUL',
      data: { message: 'Finished' },
    };
  }

  async updateMatch(id: number, newData: Partial<INewEntity<IMatch>>)
    : Promise<ServiceResponse<MessageType>> {
    const match = await this.matchModel.update(id, { ...newData });
    if (!match) {
      return {
        status: 'BAD_REQUEST',
        data: { message: 'Match already ended' },
      };
    }

    return {
      status: 'SUCCESSFUL',
      data: { message: 'Match updated' },
    };
  }

  private async teamExists(homeId: number, awayId: number):
  Promise<ServiceResponse<MessageType> | null> {
    const homeTeam = await this.teamService.findById(homeId);
    const awayTeam = await this.teamService.findById(awayId);

    if (homeTeam.status === 'NOT_FOUND') {
      return homeTeam;
    }

    if (awayTeam.status === 'NOT_FOUND') {
      return awayTeam;
    }

    return null;
  }

  async createMatch(newMatch: INewMatch): Promise<ServiceResponse<IMatch | MessageType>> {
    const error = this.schema.validateMatch(newMatch);
    if (error) {
      return { status: error.status, data: error.data };
    }

    const teamExists = await this.teamExists(newMatch.homeTeamId, newMatch.awayTeamId);
    if (teamExists) return teamExists;

    const buildMatch: INewEntity<IMatch> = {
      ...newMatch,
      inProgress: true,
    };
    const match = await this.matchModel.create(buildMatch);
    return { status: 'CREATED', data: match };
  }
}
