import { ITeam } from '../interfaces/teams/ITeam';
import { ITeamModel } from '../interfaces/teams/ITeamModel';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeam;

  async findAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();

    return teams;
  }

  async findById(id: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);

    return team;
  }
}
