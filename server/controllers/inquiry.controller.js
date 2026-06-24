import { z } from 'zod';
import { db } from '../database/db.js';

const createInquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10).max(2000)
});

export const submitInquiry = async (req, res, next) => {
  try {
    const validatedData = createInquirySchema.parse(req.body);

    await db.submitInquiry(validatedData);

    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.errors });
    next(error);
  }
};
