import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import reservationRoutes from './routes/reservationRoutes'
import tableRoutes from './routes/tableRoutes'
import orderRoutes from './routes/orderRoutes'
import paymentRoutes from './routes/paymentRoutes'
import { authenticateToken, requireAdmin } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'
import { createDefaultAdmin } from './controllers/authController'

dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Enable pre-flight requests for all routes
app.options('*', cors())

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order')
  .then(() => {
    console.log('Connected to MongoDB')
    createDefaultAdmin()
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// Public routes (no authentication required)
app.use('/api/auth', authRouter)

// Protected routes (authentication required)
app.use('/api/products', authenticateToken, productRoutes)
app.use('/api/users', authenticateToken, userRoutes)
app.use('/api/orders', authenticateToken, orderRoutes)
app.use('/api/reservations', authenticateToken, reservationRoutes)
app.use('/api/tables', authenticateToken, tableRoutes)
app.use('/api/payment', authenticateToken, paymentRoutes)

// Admin routes (authentication + admin role required)
const adminRouter = express.Router()
adminRouter.use(authenticateToken, requireAdmin)

adminRouter.use('/products', productRoutes)
adminRouter.use('/users', userRoutes)
adminRouter.use('/orders', orderRoutes)
adminRouter.use('/reservations', reservationRoutes)
adminRouter.use('/tables', tableRoutes)

app.use('/api/admin', adminRouter)

// Error handling
app.use(errorHandler)

// Handle 404
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
