import { Request, Response } from 'express'
import { tableManager } from '../data/tables'

export const getTables = async (req: Request, res: Response) => {
  try {
    console.log('Getting tables with query:', req.query)
    const { location, minCapacity } = req.query

    let tables = tableManager.getTables()
    console.log('Initial tables:', tables)

    // Filter by location if provided
    if (location) {
      tables = tableManager.getTablesByLocation(location as 'indoor' | 'outdoor')
      console.log('Tables after location filter:', tables)
    }

    // Filter by capacity if provided
    if (minCapacity) {
      tables = tableManager.getTablesByCapacity(Number(minCapacity))
      console.log('Tables after capacity filter:', tables)
    }

    return res.json({
      success: true,
      data: tables
    })
  } catch (error) {
    console.error('Get tables error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getTableById = async (req: Request, res: Response) => {
  try {
    const table = tableManager.getTableById(req.params.id)

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      })
    }

    return res.json({
      success: true,
      data: table
    })
  } catch (error) {
    console.error('Get table error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body
    const table = tableManager.updateTableStatus(req.params.id, status)

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn'
      })
    }

    return res.json({
      success: true,
      message: 'Cập nhật trạng thái bàn thành công',
      data: table
    })
  } catch (error) {
    console.error('Update table error:', error)
    return res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

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