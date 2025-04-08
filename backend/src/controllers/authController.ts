import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService'
import crypto from 'crypto'
import { Types } from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface RefreshTokenPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion?: number;
}

// Tách riêng access token và refresh token với thời gian hết hạn khác nhau
const generateAccessToken = (user: IUser) => {
  const payload = {
    userId: (user._id as Types.ObjectId).toString(),
    email: user.email,
    role: user.role
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }) // Giảm thời gian xuống 15 phút
}

const generateRefreshToken = (user: IUser & { tokenVersion?: number }) => {
  const payload = {
    userId: (user._id as Types.ObjectId).toString(),
    tokenVersion: user.tokenVersion || 0
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Received registration request:', req.body)
    const { email, password, fullName } = req.body

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists:', email)
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      })
    }

    try {
      // Gửi email chào mừng trước
      console.log('Sending welcome email to:', email)
      await sendWelcomeEmail(email, fullName)
      console.log('Welcome email sent successfully to:', email)

      // Nếu gửi email thành công thì mới tạo user
      const user = new User({
        email,
        password,
        fullName,
        role: 'user'
      })

      // Lưu user vào database
      await user.save()
      console.log('User created successfully:', email)

      // Tạo token
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      // Trả về response thành công
      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      })
    } catch (emailError) {
      // Nếu gửi email thất bại
      console.error('Failed to send welcome email:', emailError)
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email xác nhận. Vui lòng thử lại sau.'
      })
    }

  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      success: false,
      message: 'Đăng ký thất bại'
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    
    console.log('Login attempt for email:', email) // Add logging
    
    const user = await User.findOne({ email })
    
    if (!user || !await user.comparePassword(password)) {
      console.log('Login failed: Invalid credentials') // Add logging
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    }

    // Generate both tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    console.log('Login successful for user:', user.email) // Add logging

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Đăng nhập thất bại' 
    })
  }
}

// Thêm hàm để tạo tài khoản admin mặc định
export const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@coffee.com'
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      const admin = new User({
        email: adminEmail,
        password: 'admin123', // Nhớ thay đổi mật khẩu này trong môi trường production
        fullName: 'Admin',
        role: 'admin'
      })

      await admin.save()
      console.log('Default admin account created')
    }
  } catch (error) {
    console.error('Error creating default admin:', error)
  }
}

export const refreshTokenHandler = async (req: Request & { user?: IUser & { tokenVersion?: number } }, res: Response) => {
  try {
    const user = req.user; // Từ middleware verifyRefreshToken
    if (!user) {
      throw new Error('User not found');
    }
    
    // Tạo token mới
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Cập nhật tokenVersion trong database
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Decode refresh token để lấy userId
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as RefreshTokenPayload;
    
    // Tăng tokenVersion để invalidate tất cả refresh tokens hiện tại
    await User.findByIdAndUpdate(decoded.userId, {
      $inc: { tokenVersion: 1 }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    // Gửi email reset password
    await sendPasswordResetEmail(email, resetToken)

    res.json({ message: 'Email khôi phục mật khẩu đã được gửi' })
  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({ message: 'Không thể gửi email khôi phục mật khẩu' })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Tăng tokenVersion để vô hiệu hóa tất cả các token cũ
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Không thể đặt lại mật khẩu'
    });
  }
};
