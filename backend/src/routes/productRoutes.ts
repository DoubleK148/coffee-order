import express from 'express'
import multer from 'multer'
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController'

const router = express.Router()

// Multer configuration
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB for files
    fieldSize: 20 * 1024 * 1024 // 20MB for fields
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

// Public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin routes - these will only be accessible through the admin router
router.post('/', upload.single('image'), createProduct)
router.put('/:id', upload.single('image'), updateProduct)
router.delete('/:id', deleteProduct)

export default router