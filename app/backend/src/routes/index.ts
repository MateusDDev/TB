import { Router } from 'express';
import teamsRouter from './teamsRoutes';
import loginRouter from './loginRoutes';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);

export default router;
