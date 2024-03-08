import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private service = new MatchService(),
  ) {}

  async findAllMatches(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.findAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
