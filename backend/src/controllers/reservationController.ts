import { Response } from 'express'
import Reservation from '../models/Reservation'
import User from '../models/User'
import { RequestWithUser } from '../middleware/auth'
import { Types } from 'mongoose'

interface IReservation {
  _id: Types.ObjectId;
  userId: Types.ObjectId | null;
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: Date;
  time: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export const createReservation = async (req: RequestWithUser, res: Response) => {
  try {
    console.log('Creating reservation:', { body: req.body, user: req.user })

    const { name, phone, email, guests, date, time, note } = req.body

    // Validate email match only for logged in users
    if (req.user && email !== req.user.email) {
      return res.status(400).json({
        success: false,
        message: 'Email không khớp với tài khoản đang đăng nhập'
      })
    }

    const reservation = new Reservation({
      name,
      phone,
      email,
      guests,
      date,
      time,
      note,
      status: 'pending',
      userId: req.user?.userId ? new Types.ObjectId(req.user.userId) : null
    })

    await reservation.save()
    console.log('Reservation created:', reservation)

    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công',
      data: reservation
    })
  } catch (error) {
    console.error('Create reservation error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getReservations = async (req: RequestWithUser, res: Response) => {
  try {
    console.log('Getting reservations for user:', req.user)

    // Pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Build query based on user role
    const query = req.user?.role === 'admin' ? {} : { email: req.user?.email }

    // Get total count for pagination
    const total = await Reservation.countDocuments(query)

    // Get reservations with pagination
    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec() as IReservation[]

    console.log(`Found ${reservations.length} reservations`)

    // Get unique userIds
    const userIds = [...new Set(reservations
      .map(r => r.userId)
      .filter((id): id is Types.ObjectId => id !== null)
    )]

    // Get user data in one query
    const users = userIds.length > 0
      ? await User.find({ _id: { $in: userIds } })
          .select('fullName email phone')
          .lean()
          .exec()
      : []

    // Create user map for efficient lookup
    const userMap = new Map(users.map(user => [user._id.toString(), user]))

    // Map reservations with user data
    const mappedReservations = reservations.map(reservation => ({
      _id: reservation._id,
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email,
      guests: reservation.guests,
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      createdAt: reservation.createdAt,
      user: reservation.userId ? {
        _id: reservation.userId,
        name: userMap.get(reservation.userId.toString())?.fullName || reservation.name,
        email: userMap.get(reservation.userId.toString())?.email || reservation.email,
        phone: userMap.get(reservation.userId.toString())?.phone || reservation.phone
      } : null
    }))

    res.json({
      success: true,
      data: {
        reservations: mappedReservations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get reservations error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getReservationById = async (req: RequestWithUser, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .lean()
      .exec() as IReservation | null

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt bàn'
      })
    }

    // Check permission
    if (req.user?.role !== 'admin' && reservation.email !== req.user?.email) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xem đơn đặt bàn này'
      })
    }

    let userData = null
    if (reservation.userId) {
      userData = await User.findById(reservation.userId)
        .select('fullName email phone')
        .lean()
        .exec()
    }

    const mappedReservation = {
      _id: reservation._id,
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email,
      guests: reservation.guests,
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      createdAt: reservation.createdAt,
      user: userData ? {
        _id: reservation.userId,
        name: userData.fullName || reservation.name,
        email: userData.email || reservation.email,
        phone: userData.phone || reservation.phone
      } : null
    }

    res.json({
      success: true,
      data: mappedReservation
    })
  } catch (error) {
    console.error('Get reservation error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin đặt bàn',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const updateReservation = async (req: RequestWithUser, res: Response) => {
  try {
    const { status } = req.body

    // Check if reservation exists
    const existingReservation = await Reservation.findById(req.params.id)
      .lean()
      .exec() as IReservation | null

    if (!existingReservation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt bàn'
      })
    }

    // Check permission
    if (req.user?.role !== 'admin' && existingReservation.email !== req.user?.email) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật đơn đặt bàn này'
      })
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .lean()
    .exec() as IReservation | null

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt bàn'
      })
    }

    let userData = null
    if (reservation.userId) {
      userData = await User.findById(reservation.userId)
        .select('fullName email phone')
        .lean()
        .exec()
    }

    const mappedReservation = {
      _id: reservation._id,
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email,
      guests: reservation.guests,
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      createdAt: reservation.createdAt,
      user: userData ? {
        _id: reservation.userId,
        name: userData.fullName || reservation.name,
        email: userData.email || reservation.email,
        phone: userData.phone || reservation.phone
      } : null
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: mappedReservation
    })
  } catch (error) {
    console.error('Update reservation error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const deleteReservation = async (req: RequestWithUser, res: Response) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id)

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt bàn'
      })
    }

    res.json({
      success: true,
      message: 'Xóa đặt bàn thành công'
    })
  } catch (error) {
    console.error('Delete reservation error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể xóa đặt bàn'
    })
  }
}