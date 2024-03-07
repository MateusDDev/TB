import { Request, Response, Router } from 'express';
import LoginController from '../controllers/LoginController';

const teamController = new LoginController();

const router = Router();

router.post('/', (req: Request, res: Response) => teamController.login(req, res));

export default router;
