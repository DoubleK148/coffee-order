import express from 'express';
import { 
  getTables, 
  getTableByNumber,
  occupyTable,
  freeTable,
  addOrder
} from '../controllers/tableController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all tables
router.get('/', authenticateToken, getTables);

// Get table by number
router.get('/:number', authenticateToken, getTableByNumber);

// Occupy a table
router.post('/:number/occupy', authenticateToken, occupyTable);

// Free a table
router.post('/:number/free', authenticateToken, freeTable);

// Add order to table
router.post('/:number/order', authenticateToken, addOrder);

export default router; 