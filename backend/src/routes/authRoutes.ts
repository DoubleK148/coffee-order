import express from 'express';
import { register, login, refreshTokenHandler, logout, requestPasswordReset, resetPassword } from '../controllers/authController';
import { apiLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, resetPasswordRequestSchema, resetPasswordSchema } from '../middleware/validate';

const router = express.Router();

router.post('/register', apiLimiter, validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', apiLimiter, refreshTokenHandler);
router.post('/logout', apiLimiter, logout);
router.post('/request-reset', apiLimiter, validate(resetPasswordRequestSchema), requestPasswordReset);
router.post('/reset-password', apiLimiter, validate(resetPasswordSchema), resetPassword);

export default router;