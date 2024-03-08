import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private service = new MatchService(),
  ) {}

  async findAllMatches(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.service.findAll();

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findAllMatchesByStatus(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    if (inProgress !== 'true' && inProgress !== 'false') {
      return res.status(400).json({ message: 'Invalid query, expected "true" or "false"' });
    }

    const { status, data } = await this.service.findAllByStatus(inProgress);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async endMatch(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const { status, data } = await this.service.endMatch(id);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async updateMatch(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const newData = req.body;
    const { status, data } = await this.service.updateMatch(id, newData);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async createMatch(req: Request, res: Response): Promise<Response> {
    const newMatch = req.body;
    const { status, data } = await this.service.createMatch(newMatch);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
