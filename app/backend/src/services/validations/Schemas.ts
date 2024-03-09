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

  private static verifyTeams(homeId: number, awayId: number): ServiceResponse<MessageType> | null {
    if (homeId === awayId) {
      return {
        status: 'UNPROCESSABLE_ENTITY',
        data: { message: 'It is not possible to create a match with two equal teams' },
      };
    }

    return null;
  }

  public validateMatch(match: INewMatch): ServiceResponse<MessageType> | null {
    const { error } = this.matchSchema.validate(match);

    if (error) {
      return {
        status: 'BAD_REQUEST',
        data: { message: error.message },
      };
    }

    const conflict = Schemas.verifyTeams(match.homeTeamId, match.awayTeamId);
    if (conflict) {
      return conflict;
    }

    return null;
  }
}
