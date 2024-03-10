import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) {}

  async getHomeLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.getLeaderboard(true);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async getAwayLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.getLeaderboard(false);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async getDefaultLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.getDefaultLeadboard();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
