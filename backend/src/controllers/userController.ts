import { Request, Response } from 'express'
import User from '../models/User'
import { RequestWithUser } from '../middleware/auth'
// Không cần import các middleware ở đây vì chúng sẽ được sử dụng trong routes
// import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth'

export const getProfile = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
    }

    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Không thể tải thông tin người dùng' 
    })
  }
}

export const updateProfile = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
    }

    const userId = req.user.userId
    const { fullName, phone, address } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    // Cập nhật thông tin
    if (fullName) user.fullName = fullName
    if (phone) user.phone = phone
    if (address) user.address = address

    await user.save()

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '', // Thêm phone
        address: user.address || '', // Thêm address
        role: user.role
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Cập nhật thông tin thất bại' 
    })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password')
    res.json({ 
      success: true,
      users,
      message: 'Lấy danh sách người dùng thành công'
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Không thể tải danh sách người dùng' 
    })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Không thể tải thông tin người dùng' })
  }
}

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, address } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, address },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      })
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Cập nhật thông tin thất bại' 
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản admin' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Xóa người dùng thành công' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Xóa người dùng thất bại' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật thông tin
    user.fullName = fullName;
    user.phone = phone;
    user.address = address;
    user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Cập nhật thông tin thất bại' });
  }
}; 