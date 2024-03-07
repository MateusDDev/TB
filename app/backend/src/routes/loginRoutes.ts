import { Request, Response, Router } from 'express';
import LoginController from '../controllers/LoginController';
import Validations from '../middlewares/Validations';

const loginController = new LoginController();

const router = Router();

router.post('/', (req: Request, res: Response) => loginController.login(req, res));

router.get(
  '/role',
  Validations.validateLogin,
  (req: Request, res: Response) => loginController.findRole(req, res),
);

export default router;
