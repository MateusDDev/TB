import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => {
    if (req.query.inProgress !== undefined) {
      matchController.findAllMatchesByStatus(req, res);
    } else {
      matchController.findAllMatches(req, res);
    }
  },
);

export default router;
