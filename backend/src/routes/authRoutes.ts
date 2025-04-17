import express from 'express';
import { register, login, refreshTokenHandler, logout, requestPasswordReset, resetPassword } from '../controllers/authController';
import { apiLimiter } from '../middleware/rateLimiter';
import { validateZod } from '../middleware/validate';
import { loginSchema, registerSchema, resetPasswordRequestSchema, resetPasswordSchema } from '../middleware/validate';

const router = express.Router();

router.post('/register', apiLimiter, validateZod(registerSchema), register);
router.post('/login', validateZod(loginSchema), login);
router.post('/refresh-token', apiLimiter, refreshTokenHandler);
router.post('/logout', apiLimiter, logout);
router.post('/request-reset', apiLimiter, validateZod(resetPasswordRequestSchema), requestPasswordReset);
router.post('/reset-password', apiLimiter, validateZod(resetPasswordSchema), resetPassword);

export default router;