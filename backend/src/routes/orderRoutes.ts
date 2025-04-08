import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
} from '../controllers/orderController';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', createOrder);
router.get('/my', getUserOrders);

// Admin routes - these will only be accessible through the admin router
router.get('/', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router; 