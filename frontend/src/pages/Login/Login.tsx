import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { login as loginService } from '../../services/authService'
import { useAuth } from '@/contexts/AuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập đầy đủ email và mật khẩu')
      }

      const response = await loginService({ email, password })
      console.log('Login successful:', response)

      // Kiểm tra response trước khi chuyển hướng
      if (response.user && response.user.role) {
        // Cập nhật context
        login(response.user)
        
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      } else {
        throw new Error('Invalid user data received')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <button 
        className="back-home" 
        onClick={() => navigate('/')}
      >
        <ArrowBackIcon /> Back to Home
      </button>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-field">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-field">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 