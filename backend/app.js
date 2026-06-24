import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';

// Load environmental variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet (sets various HTTP headers to secure Express app)
app.use(helmet());

// Rate Limiting: Prevent DDoS and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});
app.use(limiter);

// Enable CORS for frontend Vite client on http://localhost:5173
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
  });
  next();
});

// Main API Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Kesalahan server internal' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 NUSA-BENCH Server is running on http://localhost:${PORT}`);
  });
}

export default app;
