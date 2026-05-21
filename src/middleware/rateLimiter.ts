import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: { success: false, message: 'Sabar dong, kamu kebanyakan test. tunggu 1 menit lagi' },
  standardHeaders: true,
  legacyHeaders: false
});

