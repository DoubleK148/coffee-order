import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Person as PersonIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import './Profile.css'
import { updateProfile, getUserById, getProfile } from '../../services/userService'

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const Profile = () => {
  const location = useLocation()
  const [tabValue, setTabValue] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()

    // Kiểm tra nếu có query param edit=true thì bật chế độ chỉnh sửa
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true)
    }
  }, [location])

  const fetchProfile = async () => {
    try {
      const user = await getProfile()
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError(null)

    try {
      const user = await updateProfile(formData)
      setIsEditing(false)
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
      setMessage('Cập nhật thông tin thành công')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thông tin thất bại')
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleRefresh = async () => {
    try {
      setError('')
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (currentUser._id) {
        const user = await getUserById(currentUser._id)
        setFormData({
          fullName: user.fullName || '',
          phone: user.phone || '',
          address: user.address || '',
          email: user.email || ''
        })
        localStorage.setItem('user', JSON.stringify(user))
        setMessage('Đã cập nhật thông tin mới nhất')
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      setError('Không thể tải thông tin mới')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} className="profile-container">
        {/* Header Section */}
        <Box className="profile-header">
          <Avatar
            sx={{ width: 120, height: 120 }}
            className="profile-avatar"
          >
            {formData.fullName ? formData.fullName.charAt(0) : '?'}
          </Avatar>
          <Typography variant="h4" className="profile-name">
            {formData.fullName || 'Chưa cập nhật'}
          </Typography>
        </Box>

        {/* Thêm phần hiển thị thông báo */}
        {message && (
          <Alert severity="success" sx={{ mb: 2, mx: 3 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2, mx: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab icon={<PersonIcon />} label="Thông tin cá nhân" />
            <Tab icon={<HistoryIcon />} label="Lịch sử đơn hàng" />
            <Tab icon={<FavoriteIcon />} label="Sản phẩm yêu thích" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false)
                        setError('')
                        fetchProfile()
                      }}
                      sx={{ mr: 1 }}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{ mr: 1 }}
                    >
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={!isEditing}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Order History Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Thêm component OrderHistory ở đây */}
          <Typography variant="h6" color="text.secondary">
            Lịch sử đơn hàng của bạn
          </Typography>
        </TabPanel>

        {/* Favorites Tab */}
        <TabPanel value={tabValue} index={2}>
          {/* Thêm component Favorites ở đây */}
          <Typography variant="h6" color="text.secondary">
            Sản phẩm yêu thích của bạn
          </Typography>
        </TabPanel>

        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          sx={{ mt: 2 }}
        >
          Làm mới thông tin
        </Button>
      </Paper>
    </Container>
  )
}

export default Profile