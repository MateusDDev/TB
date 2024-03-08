import { Router } from 'express';
import teamsRouter from './teamsRoutes';
import loginRouter from './loginRoutes';
import matchRouter from './matchRoutes';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);
router.use('/matches', matchRouter);

export default router;
