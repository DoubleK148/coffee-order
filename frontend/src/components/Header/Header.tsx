import { useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Badge
} from '@mui/material'
import { Person, Logout, AccountCircle, ShoppingCart, TableBar } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { logout } from '../../services/authService'
import { useCart } from '../../contexts/CartContext'
import { useTable } from '@/contexts/TableContext'
import { useAuth } from '@/contexts/AuthContext'
import ReturnTableDialog from '../ReturnTableDialog/ReturnTableDialog'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { state } = useCart()
  const { tables } = useTable()
  const { user } = useAuth()
  const token = localStorage.getItem('token')
  const [showReturnTableDialog, setShowReturnTableDialog] = useState(false)

  // Kiểm tra xem user hiện tại có đang ngồi ở bàn nào không
  const hasOccupiedTable = user && Array.isArray(tables) && tables.some(table => 
    table.status === 'occupied' && 
    table.customerInfo?.email === user.email
  )

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/login')
  }

  const handleProfile = () => {
    handleMenuClose()
    navigate('/profile')
  }

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      // Đợi một chút để trang chủ được load xong rồi mới scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <AppBar position="fixed" className="glass-effect">
        <Toolbar className="header-toolbar">
          <Box className="logo-container" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="logo" />
            <span className="brand-name">
              E Coffee 
            </span>
          </Box>

          <Box className="menu-container">
            <Button 
              className="menu-button hover-underline"
              onClick={() => scrollToSection('home')}
            >
              Home
            </Button>
            
            <Button 
              className="menu-button hover-underline"
              onClick={() => scrollToSection('about')}
            >
              About
            </Button>

            <Button 
              className="menu-button hover-underline"
              onClick={() => scrollToSection('special')}
            >
              Special
            </Button>

            <Button 
              className="menu-button hover-underline"
              onClick={() => scrollToSection('blog')}
            >
              Blog
            </Button>

            <Button 
              className="menu-button hover-underline"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </Button>
          </Box>

          <Box className="actions-container">
            {token && hasOccupiedTable && (
              <Button
                color="inherit"
                startIcon={<TableBar />}
                onClick={() => setShowReturnTableDialog(true)}
                className="return-table-button hover-lift"
                sx={{ mr: 2 }}
              >
                Trả bàn
              </Button>
            )}
            <IconButton 
              color="inherit"
              onClick={() => navigate('/cart')}
              className="cart-button hover-lift"
            >
              <Badge badgeContent={state.items.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {token ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                  className="profile-button hover-lift"
                >
                  <Person />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  className="dropdown-menu"
                >
                  <MenuItem onClick={handleProfile} className="menu-item hover-lift">
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Thông tin cá nhân" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} className="menu-item hover-lift">
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                className="login-button"
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <ReturnTableDialog
        open={showReturnTableDialog}
        onClose={() => setShowReturnTableDialog(false)}
      />
    </>
  )
}

export default Header