import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(private service = new TeamService()) {

  }

  public async findAllTeams(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.findAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
