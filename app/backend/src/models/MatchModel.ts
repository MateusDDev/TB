import { INewEntity } from '../interfaces/INewEntity';
import { IMatch, IMatchWithAssociations } from '../interfaces/matches/IMatch';
import { IMatchModel } from '../interfaces/matches/IMacthModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private association = SequelizeTeam;

  async findAll(): Promise<IMatchWithAssociations[]> {
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
    return matches as unknown as IMatchWithAssociations[];
  }

  async findById(id: number): Promise<IMatch | null> {
    const match = this.model.findByPk(id);
    return match;
  }

  async findAllByStatus(status: 'true' | 'false'): Promise<IMatchWithAssociations[]> {
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

    return matches as unknown as IMatchWithAssociations[];
  }

  async update(id: number, match: Partial<INewEntity<IMatch>>): Promise<IMatch | null> {
    const [affectedRows] = await this.model.update(match, {
      where: { id },
    });
    if (affectedRows === 0) return null;

    return this.findById(id);
  }

  async create(newMatch: INewEntity<IMatch>): Promise<IMatch> {
    const match = await this.model.create(newMatch);

    return match;
  }
}
