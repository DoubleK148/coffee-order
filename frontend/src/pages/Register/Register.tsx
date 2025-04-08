import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { register } from '../../services/authService'
import './Register.css'
import { Box, Button, Typography, Alert } from '@mui/material'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Thêm validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Vui lòng điền đầy đủ thông tin')
      setLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự')
      setLoading(false)
      return
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Mật khẩu phải chứa chữ hoa, chữ thường và số')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      })
      
      if (response.success) {
        setMessage('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="register-page">
      <button 
        className="back-home" 
        onClick={() => navigate('/')}
      >
        <ArrowBackIcon /> Back to Home
      </button>
      <Box className="wrapper">
        <Typography variant="h4" component="h2">
          Đăng ký
        </Typography>
        
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <label>Email</label>
          </div>

          <div className="input-field">
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <label>Họ và tên</label>
          </div>

          <div className="input-field">
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <label>Mật khẩu</label>
          </div>

          <div className="input-field">
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <label>Xác nhận mật khẩu</label>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
          
          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </Box>
    </Box>
  )
}

export default Register