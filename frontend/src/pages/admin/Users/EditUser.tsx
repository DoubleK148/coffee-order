import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import { getUserById, updateUser } from '../../../services/userService'

interface FormData {
  fullName: string
  phone: string
  address: string
  email: string
}

interface UpdateResponse {
  success: boolean
  message: string
  user: {
    fullName: string
    phone: string
    address: string
    email: string
  }
}

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await getUserById(id!)
      if (response.success && response.data?.user) {
        setFormData({
          fullName: response.data.user.fullName,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          email: response.data.user.email
        })
      }
    } catch (error) {
      setError('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await updateUser(id!, formData) as unknown as UpdateResponse
      if (response.success) {
        setSuccess('Cập nhật thông tin thành công!')
        setTimeout(() => {
          navigate('/admin/users')
        }, 1500)
      } else {
        setError(response.message || 'Cập nhật thất bại')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thông tin thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Chỉnh sửa thông tin người dùng
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={formData.email}
          disabled
        />

        <TextField
          fullWidth
          label="Họ tên"
          margin="normal"
          value={formData.fullName}
          onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          required
        />

        <TextField
          fullWidth
          label="Số điện thoại"
          margin="normal"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />

        <TextField
          fullWidth
          label="Địa chỉ"
          margin="normal"
          value={formData.address}
          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={saving}
        >
          {saving ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Đang lưu...
            </>
          ) : 'Lưu thay đổi'}
        </Button>
      </form>
    </Paper>
  )
}

export default EditUser