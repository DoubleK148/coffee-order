import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderSchema, orderIdSchema } from '../validation/orderValidation';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authenticateToken, validate(createOrderSchema), createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, validate(orderIdSchema), getOrderById);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticateToken, requireAdmin, validate(updateOrderSchema), updateOrderStatus);

export default router; 