import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getHomeLeaderboard(req, res),
);
router.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.getAwayLeaderboard(req, res),
);
router.get(
  '/',
  (req: Request, res: Response) => leaderboardController.getDefaultLeaderboard(req, res),
);

export default router;
