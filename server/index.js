import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import scoreRoutes from './routes/score.routes.js';
import questionRoutes from './routes/question.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initDB } from './database/db.js';

dotenv.config();
initDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(apiLimiter); // Global rate limiting
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // JSON parser


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/scores', scoreRoutes);
app.use('/api/v1/questions', questionRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

