import express from 'express';
import { getRandomQuestions, verifyAnswer } from '../controllers/question.controller.js';
import { verifySupabaseToken } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints to fetch questions
router.get('/', getRandomQuestions);

// Protecting the answer verification to prevent abuse, or keep it public for unauthenticated players.
// The PRD says "Profil Pengguna (LocalStorage)" is P0, meaning unauthenticated users can play.
// So we keep verifyAnswer public as well.
router.post('/verify', verifyAnswer);

export default router;
