import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(private service = new TeamService()) {

  }

  async findAllTeams(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.findAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findTeamById(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const { status, data } = await this.service.findById(id);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
