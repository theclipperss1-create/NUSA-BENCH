import express from 'express';
import { submitInquiry } from '../controllers/inquiry.controller.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/v1/inquiries
// This route is public so anyone can submit a contact form
router.post('/', strictLimiter, submitInquiry);

export default router;

