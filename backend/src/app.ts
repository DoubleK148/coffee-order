import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import { createDefaultAdmin } from './controllers/authController'
import productRoutes from './routes/productRoutes'
import reservationRoutes from './routes/reservationRoutes'
import tableRoutes from './routes/table.routes'
import orderRoutes from './routes/orderRoutes'
import paymentRoutes from './routes/paymentRoutes'
import { authenticateToken, requireAdmin } from './middleware/auth'

dotenv.config()

const app = express()

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Enable pre-flight requests for all routes
app.options('*', cors())

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order')
  .then(() => {
    console.log('Connected to MongoDB')
    // Create default admin user
    createDefaultAdmin()
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// Public API Routes (no authentication required)
app.use('/api/auth', authRouter)
app.use('/api/products', productRoutes)

// Protected API Routes (authentication required)
const protectedRouter = express.Router()
protectedRouter.use(authenticateToken)

protectedRouter.use('/users', userRoutes)
protectedRouter.use('/orders', orderRoutes)
protectedRouter.use('/reservations', reservationRoutes)
protectedRouter.use('/tables', tableRoutes)
protectedRouter.use('/payment', paymentRoutes)

app.use('/api', protectedRouter)

// Admin API Routes (authentication + admin role required)
const adminRouter = express.Router()
adminRouter.use(authenticateToken, requireAdmin)

adminRouter.use('/products', productRoutes)
adminRouter.use('/users', userRoutes)
adminRouter.use('/orders', orderRoutes)
adminRouter.use('/reservations', reservationRoutes)
adminRouter.use('/tables', tableRoutes)

app.use('/api/admin', adminRouter)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err)
  
  // If headers have already been sent, delegate to the default error handler
  if (res.headersSent) {
    return next(err)
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

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
