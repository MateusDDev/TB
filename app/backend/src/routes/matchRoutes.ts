import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import Validations from '../middlewares/Validations';

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

router.patch(
  '/:id/finish',
  Validations.validateLogin,
  (req: Request, res: Response) => matchController.endMatch(req, res),
);

router.patch(
  '/:id',
  Validations.validateLogin,
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);

router.post(
  '/',
  Validations.validateLogin,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);

export default router;
