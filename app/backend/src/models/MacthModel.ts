import { IMatch } from '../interfaces/matches/IMatch';
import { IMatchModel } from '../interfaces/matches/IMacthModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private association = SequelizeTeam;

  async findAll(): Promise<IMatch[]> {
    const matches = this.model.findAll({
      include: [
        {
          model: this.association,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: this.association,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  }

  async findById(id: number): Promise<IMatch | null> {
    const match = this.model.findByPk(id);
    return match;
  }

  async findAllByStatus(status: 'true' | 'false'): Promise<IMatch[] | null> {
    const inProgress = status === 'true';
    const matches = this.model.findAll({
      where: { inProgress },
      include: [
        {
          model: this.association,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: this.association,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });

    return matches;
  }
}
