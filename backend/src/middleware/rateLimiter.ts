import rateLimit from 'express-rate-limit';

// Rate limiter cho login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // 5 lần thử đăng nhập
  message: { message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho authentication
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});