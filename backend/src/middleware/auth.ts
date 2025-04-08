import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User'


// Định nghĩa interface cho decoded token
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Interface cho Request với user
export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  }
}

// Middleware xác thực token
export const authenticateToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    console.log('Auth header:', authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided or invalid format')
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      })
    }

    const token = authHeader.split(' ')[1]
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken
      console.log('Decoded token:', decoded)

      const user = await User.findById(decoded.userId).select('_id email role')
      console.log('Found user:', user)

      if (!user) {
        console.log('User not found for token:', decoded)
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        })
      }
      req.user = {
        userId: user._id?.toString() || '',
        email: user.email as string,
        role: user.role as string
      }

      console.log('Set user in request:', req.user)
      next()
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError)
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: 'Token đã hết hạn'
        })
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({
          success: false,
          message: 'Token không hợp lệ'
        })
      } else {
        return res.status(403).json({
          success: false,
          message: 'Lỗi xác thực'
        })
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực'
    })
  }
}

// Middleware kiểm tra role admin
export const requireAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  console.log('Checking admin role for user:', req.user)
  
  if (!req.user) {
    console.log('No user found in request')
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập'
    })
  }

  if (req.user.role !== 'admin') {
    console.log('User is not admin:', req.user)
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập'
    })
  }

  console.log('Admin access granted')
  next()
}

// Middleware kiểm tra role user
export const requireUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
  console.log('Checking user authentication:', req.user)
  
  if (!req.user) {
    console.log('No user found in request')
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập'
    })
  }

  console.log('User access granted')
  next()
} 