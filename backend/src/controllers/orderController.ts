import { Response } from 'express';
import Order from '../models/Order';
import { RequestWithUser } from '../middleware/auth';
import Product from '../models/Product';
//import { sendOrderConfirmationEmail } from '../utils/email';

interface OrderItem {
  productId: string;
  quantity: number;
}

export const createOrder = async (req: RequestWithUser, res: Response) => {
  try {
    const { items, totalAmount, paymentMethod, note } = req.body;

    // Validate user
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để đặt hàng'
      });
    }

    // Validate items
    if (!items?.length) {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng phải có ít nhất một sản phẩm'
      });
    }

    // Validate payment method
    if (!['cash', 'momo', 'card'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Phương thức thanh toán không hợp lệ'
      });
    }

    // Kiểm tra tồn tại và tình trạng của sản phẩm
    const productIds = items.map((item: OrderItem) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      status: 'available'
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Một số sản phẩm không còn khả dụng'
      });
    }

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
      paymentMethod,
      note,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Gửi email xác nhận đơn hàng
   // await sendOrderConfirmationEmail(req.user.email, order);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo đơn hàng'
    });
  }
};

export const getUserOrders = async (req: RequestWithUser, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user?.userId })
      .populate('items.productId')
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

export const getOrderById = async (req: RequestWithUser, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user?.userId
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin đơn hàng'
    });
  }
};

export const updateOrderStatus = async (req: RequestWithUser, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findById(req.params.id);
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