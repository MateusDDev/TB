import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IMatch } from '../interfaces/matches/IMatch';
import MatchModel from '../models/MacthModel';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
  ) {}

  async findAll(): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll();

    return {
      status: 'SUCCESSFUL',
      data: matches,
    };
  }
}
