import express from 'express';
import { submitScore, getLeaderboard, getUserScores } from '../controllers/score.controller.js';
import { verifySupabaseToken } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route for leaderboard
router.get('/leaderboard/:game_type', getLeaderboard);

// Protected routes
router.use(verifySupabaseToken);
router.post('/', strictLimiter, submitScore);
router.get('/me', getUserScores);


export default router;
