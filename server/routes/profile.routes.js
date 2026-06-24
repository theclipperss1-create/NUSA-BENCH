import express from 'express';
import { getProfile, updateProfile, getProfileByUsername } from '../controllers/profile.controller.js';
import { verifySupabaseToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(verifySupabaseToken);

// GET /api/v1/profiles/me
router.get('/me', getProfile);

// GET /api/v1/profiles/user/:username
router.get('/user/:username', getProfileByUsername);

// PUT /api/v1/profiles/me
router.put('/me', updateProfile);

export default router;
