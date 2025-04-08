import express from 'express'
import { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getProfile,
} from '../controllers/userController'

const router = express.Router()

// Protected routes (require authentication)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

// Admin routes - these will only be accessible through the admin router
router.get('/', getUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router