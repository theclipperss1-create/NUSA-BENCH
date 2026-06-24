import rateLimit from 'express-rate-limit';

// General API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.'
  }
});

// Strict Rate Limiter for sensitive endpoints (e.g., submitting scores, contact forms)
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Permintaan terlalu cepat. Harap tunggu beberapa saat.'
  }
});
