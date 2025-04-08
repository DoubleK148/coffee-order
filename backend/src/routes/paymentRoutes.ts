import express from 'express';
import { createMomoPayment, verifyMomoPayment, handleMomoIPN } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Route thanh toán MoMo
router.post('/momo/create', authenticateToken, createMomoPayment);
router.post('/momo/verify', authenticateToken, verifyMomoPayment);
// Route nhận IPN từ MoMo - không cần authentication vì MoMo gọi trực tiếp
router.post('/momo/notify', handleMomoIPN);

export default router; 