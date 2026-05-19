import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { getFeed, getTrending, getLeaderboard } from '../controllers/feed.controller';

const router = Router();

router.get('/', optionalAuth, getFeed);
router.get('/trending', optionalAuth, getTrending);
router.get('/leaderboard', getLeaderboard);

export default router;
