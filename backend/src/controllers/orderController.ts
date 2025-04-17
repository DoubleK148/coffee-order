import { Response } from 'express';
import Order from '../models/Order';
import { RequestWithUser } from '../middleware/auth';
import Product from '../models/Product';
import { validateOrder } from '../utils/validation';
//import { sendOrderConfirmationEmail } from '../utils/email';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

// Tạo đơn hàng mới
export const createOrder = async (req: RequestWithUser, res: Response) => {
  try {
    console.log('Creating order with data:', JSON.stringify(req.body, null, 2));
    
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Fetch product details for each item
    const orderItemsPromises = req.body.items.map(async (item: any) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found with id: ${item.productId}`);
      }
      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        note: item.note || ''
      };
    });

    const orderItems = await Promise.all(orderItemsPromises);
    console.log('Mapped order items with names:', JSON.stringify(orderItems, null, 2));

    // Create order document
    const orderData = {
      userId: req.user.userId,
      items: orderItems,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
      note: req.body.note || ''
    };

    console.log('Creating order document:', JSON.stringify(orderData, null, 2));

    const order = new Order(orderData);

    // Save to database
    console.log('Attempting to save order to database...');
    const savedOrder = await order.save();
    console.log('Order saved successfully:', JSON.stringify(savedOrder, null, 2));

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order: savedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không thể tạo đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đơn hàng'
    });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra quyền truy cập
    if (order.userId.toString() !== req.user?.userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem đơn hàng này'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin đơn hàng'
    });
  }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req: RequestWithUser, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đơn hàng'
    });
  }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req: RequestWithUser, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái đơn hàng'
    });
  }
};