import { z } from 'zod';
import { db } from '../database/db.js';

const submitScoreSchema = z.object({
  game_type: z.enum(['reaction_time', 'aim_trainer', 'number_memory', 'sequence_memory', 'visual_memory', 'verbal_memory', 'wawasan_indonesia']),
  score_value: z.number(),
  additional_data: z.record(z.any()).optional()
});

export const submitScore = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const validatedData = submitScoreSchema.parse(req.body);

    const result = await db.submitScore(
      userId, 
      validatedData.game_type, 
      validatedData.score_value, 
      validatedData.additional_data || {}
    );

    res.status(201).json({
      data: result.score,
      profile: result.profile,
      xpGained: result.xpGained,
      isNewPersonalBest: result.isNewPersonalBest,
      levelUp: result.levelUp
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.errors });
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { game_type } = req.params;
    const data = await db.getLeaderboard(game_type);
    res.status(200).json({ data });
  } catch (error) { next(error); }
};

export const getUserScores = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const data = await db.getUserScores(userId);
    res.status(200).json({ data });
  } catch (error) { next(error); }
};
