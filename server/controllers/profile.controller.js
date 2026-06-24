import { z } from 'zod';
import { db } from '../database/db.js';

const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500, "Bio max 500 characters").optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(),
  avatar_url: z.string().optional(), // Emoji string or URL
});

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const profile = await db.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json({ data: profile });
  } catch (error) { next(error); }
};

export const getProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await db.getProfileByUsername(username);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json({ data: profile });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedProfile = await db.updateProfile(userId, validatedData);
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json({ data: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.errors });
    next(error);
  }
};
