import { Router } from 'express';
import teamsRouter from './teamsRoutes';
import loginRouter from './loginRoutes';
import matchRouter from './matchRoutes';
import leaderboardRouter from './leaderboardRoutes';

const router = Router();

router.use('/leaderboard', leaderboardRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchRouter);
router.use('/login', loginRouter);

export default router;
