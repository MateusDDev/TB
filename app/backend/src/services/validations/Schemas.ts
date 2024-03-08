import Joi = require('joi');
import { INewMatch } from '../../interfaces/matches/IMatch';
import { MessageType, ServiceResponse } from '../../interfaces/ServiceResponse';

export default class Schemas {
  private matchSchema = Joi.object<INewMatch>({
    awayTeamGoals: Joi.number().min(1).required(),
    awayTeamId: Joi.number().min(1).required(),
    homeTeamGoals: Joi.number().min(1).required(),
    homeTeamId: Joi.number().min(1).required(),
  });

  public validateMatch(match: INewMatch): ServiceResponse<MessageType> | null {
    const { error } = this.matchSchema.validate(match);

    if (error) {
      return {
        status: 'BAD_REQUEST',
        data: { message: error.message },
      };
    }

    return null;
  }
}
