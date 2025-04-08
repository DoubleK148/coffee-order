import { Request, Response } from 'express'

interface CustomError extends Error {
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ', 
      errors: err.message
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Không có quyền truy cập'
    })
  }

  if (err.code === 'ENOENT') {
    return res.status(404).json({
      message: 'File không tồn tại'
    });
  }

  res.status(500).json({
    message: 'Lỗi server'
  })
}