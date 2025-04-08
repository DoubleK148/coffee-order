import express from 'express';
import { getTables, updateTableStatus } from '../controllers/tableController';

const router = express.Router();

router.get('/', getTables);
router.patch('/:tableNumber/status', updateTableStatus);

export default router; 