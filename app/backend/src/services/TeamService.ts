import { ServiceResponse } from '../interfaces/ServiceResponse';
import { ITeam } from '../interfaces/teams/ITeam';
import TeamModel from '../models/TeamModel';

export default class TeamService {
  constructor(private model = new TeamModel()) {

  }

  async findAll(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.model.findAll();

    return {
      status: 'SUCCESSFUL',
      data: teams,
    };
  }

  async findById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.model.findById(id);
    if (!team) {
      return {
        status: 'NOT_FOUND',
        data: { message: 'Team not found' },
      };
    }

    return {
      status: 'SUCCESSFUL',
      data: team,
    };
  }
}
