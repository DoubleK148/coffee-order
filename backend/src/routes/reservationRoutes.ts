import express from 'express'
import { 
  createReservation, 
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from '../controllers/reservationController'

const router = express.Router()

// Protected routes (require authentication)
router.post('/', createReservation)

// Admin routes - these will only be accessible through the admin router
router.get('/', getReservations)
router.get('/:id', getReservationById)
router.put('/:id', updateReservation)
router.delete('/:id', deleteReservation)

export default router 