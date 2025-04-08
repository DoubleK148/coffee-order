import { Request, Response } from 'express'
import Product, { IProduct } from '../models/Product'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/products')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Sử dụng memoryStorage để xử lý file thành base64
const storage = multer.memoryStorage();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}).single('image');

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, status } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng tải lên hình ảnh sản phẩm'
      });
    }

    // Chuyển file thành base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      status: status || 'available',
      image: base64Image
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo sản phẩm'
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ status: 'available' });
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách sản phẩm'
    });
  }
};

export const getProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Get products admin error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách sản phẩm'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updateData: Partial<IProduct> = {
      ...req.body,
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : undefined,
      status: req.body.status || 'available',
      ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
      preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : undefined,
      calories: req.body.calories ? Number(req.body.calories) : undefined,
      isBestSeller: req.body.isBestSeller === 'true'
    };

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      updateData.image = base64Image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Cập nhật sản phẩm thất bại' 
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    // Xóa file ảnh
    if (product.image) {
      const imagePath = path.join(__dirname, '../../', product.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await Product.findByIdAndDelete(productId)

    res.json({
      message: 'Xóa sản phẩm thành công'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Xóa sản phẩm thất bại' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json({ product })
  } catch (error) {
    console.error('Get product by id error:', error)
    res.status(500).json({ message: 'Không thể tải thông tin sản phẩm' })
  }
} 