import { Router } from 'express';
import teamsRouter from './teamsRoutes';

const router = Router();

router.use('/teams', teamsRouter);

export default router;
