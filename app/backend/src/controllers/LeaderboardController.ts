import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) {}

  async getLeaderboard(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.leaderboardService.getLeaderboard();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
