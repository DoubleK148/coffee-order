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
    fileSize: 20 * 1024 * 1024 // 20MB
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
    const products = await Product.find({ status: 'available' })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm nào'
      });
    }

    res.json({
      success: true,
      data: {
        products: products,
        total: products.length
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm nào'
      });
    }

    res.json({
      success: true,
      data: {
        products: products,
        total: products.length
      }
    });
  } catch (error) {
    console.error('Get products admin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    console.log('Update Product - Request Body:', req.body);
    console.log('Update Product - File:', req.file);
    
    const { price, discountPrice, preparationTime, calories, ingredients, status, isBestSeller, keepCurrentImage, ...rest } = req.body;
    
    // Log parsed values
    console.log('Parsed values:', {
      price,
      discountPrice,
      preparationTime,
      calories,
      ingredients,
      status,
      isBestSeller,
      keepCurrentImage,
      rest
    });
    
    // Validate numeric fields
    const updateData: Partial<IProduct> = {
      ...rest,
      price: price ? Number(price) : undefined,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      preparationTime: preparationTime ? Number(preparationTime) : undefined,
      calories: calories ? Number(calories) : undefined,
      status: status || 'available',
      isBestSeller: typeof isBestSeller === 'boolean' ? isBestSeller : String(isBestSeller).toLowerCase() === 'true'
    };

    console.log('Update data to be applied:', updateData);

    // Handle ingredients array
    if (ingredients) {
      try {
        updateData.ingredients = JSON.parse(ingredients);
        console.log('Parsed ingredients:', updateData.ingredients);
      } catch (error) {
        console.error('Error parsing ingredients:', error);
        updateData.ingredients = [];
      }
    }

    // Handle image if uploaded
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      updateData.image = base64Image;
    }
    // If no new image and not keeping current image, remove image field from update
    else if (!keepCurrentImage) {
      updateData.image = undefined;
    }
    // If keepCurrentImage is true, don't modify the image field

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log('Product not found with ID:', productId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    console.log('Product updated successfully:', updatedProduct);

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Cập nhật sản phẩm thất bại',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      })
    }

    await Product.findByIdAndDelete(productId)

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false, 
      message: 'Xóa sản phẩm thất bại'
    })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('-__v')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải thông tin sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 