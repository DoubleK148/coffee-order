import { Request, Response } from 'express'
import { tableManager } from '../data/tables'
import { CustomerInfo, TableOrder, OrderItem } from '../types/table'
import { Types } from 'mongoose'

export const getTables = async (_req: Request, res: Response) => {
  try {
    const tables = tableManager.getTables()
    return res.json(tables)
  } catch (error) {
    console.error('Get tables error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getTableByNumber = async (req: Request, res: Response) => {
  try {
    const tableNumber = parseInt(req.params.number)
    if (isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số bàn không hợp lệ'
      })
    }

    const table = tableManager.getTableByNumber(tableNumber)
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      })
    }

    return res.json(table)
  } catch (error) {
    console.error('Get table error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const occupyTable = async (req: Request, res: Response) => {
  try {
    const tableNumber = parseInt(req.params.number)
    const { customerInfo } = req.body

    if (isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số bàn không hợp lệ'
      })
    }

    if (!customerInfo?.name || !customerInfo?.email) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin khách hàng không đầy đủ'
      })
    }

    const table = tableManager.updateTableStatus(tableNumber, 'occupied', {
      ...customerInfo,
      tableNumber
    })

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      })
    }

    return res.json(table)
  } catch (error) {
    console.error('Occupy table error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const freeTable = async (req: Request, res: Response) => {
  try {
    const tableNumber = parseInt(req.params.number)
    if (isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số bàn không hợp lệ'
      })
    }

    const table = tableManager.updateTableStatus(tableNumber, 'available')
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      })
    }

    return res.json(table)
  } catch (error) {
    console.error('Free table error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const addOrder = async (req: Request, res: Response) => {
  try {
    const tableNumber = parseInt(req.params.number)
    const orderData = req.body

    if (isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Số bàn không hợp lệ'
      })
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin đơn hàng không hợp lệ'
      })
    }

    const order: TableOrder = {
      orderId: new Types.ObjectId(),
      items: orderData.items,
      totalAmount: orderData.items.reduce(
        (total: number, item: OrderItem) => total + item.price * item.quantity, 
        0
      ),
      paymentStatus: 'pending',
      createdAt: new Date()
    }

    const table = tableManager.updateTableOrder(tableNumber, order)

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn hoặc bàn không trong trạng thái sử dụng'
      })
    }

    return res.json(table)
  } catch (error) {
    console.error('Add order error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể thêm đơn hàng',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const { status, customerInfo } = req.body;
    console.log('Updating table status:', { tableId: req.params.id, status, customerInfo });

    // Validate status
    if (!['available', 'occupied', 'reserved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái bàn không hợp lệ'
      });
    }

    // If status is 'reserved' or 'occupied', customerInfo is required
    if ((status === 'reserved' || status === 'occupied') && !customerInfo?.name) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin khách hàng là bắt buộc khi đặt bàn hoặc có khách'
      });
    }

    const table = tableManager.updateTableStatus(parseInt(req.params.id), status, customerInfo);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      });
    }

    return res.json({
      success: true,
      message: 'Cập nhật trạng thái bàn thành công',
      data: table
    });
  } catch (error) {
    console.error('Update table error:', error);
    return res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const resetTables = async (_req: Request, res: Response) => {
  try {
    tableManager.resetTables()
    return res.json({
      success: true,
      message: 'Đặt lại trạng thái bàn thành công',
      data: tableManager.getTables()
    })
  } catch (error) {
    console.error('Reset tables error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể đặt lại trạng thái bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getAvailableTables = async (_req: Request, res: Response) => {
  try {
    const tables = tableManager.getAvailableTables()
    return res.json({
      success: true,
      data: tables
    })
  } catch (error) {
    console.error('Get available tables error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách bàn trống',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 