import express from 'express'
import { 
  getTables, 
  getTableById, 
  updateTableStatus, 
  resetTables, 
  getAvailableTables 
} from '../controllers/tableController'

const router = express.Router()

// Public routes
router.get('/available', getAvailableTables)

// Protected routes (require authentication)
router.get('/', getTables)
router.get('/:id', getTableById)

// Admin routes
router.put('/:id', updateTableStatus)
router.post('/reset', resetTables)

export default router 