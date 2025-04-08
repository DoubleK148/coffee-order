import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  styled
} from '@mui/material'
import { Person, Logout, AccountCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { logout } from '../../services/authService'
import { useState, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import { useCart } from '../../contexts/CartContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

// Styled components
const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#cab09a',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
}))

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 0,
  cursor: 'pointer'
})

const Logo = styled('img')({
  height: '60px',
  marginRight: '12px',
  objectFit: 'contain'
})

const BrandName = styled('span')({
  textDecoration: 'none',
  color: '#FDF8F5',
  fontSize: '2rem',
  fontWeight: 'bold',
  fontFamily: '"Playfair Display", serif',
  letterSpacing: '1px',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
})

const MenuContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexGrow: 1
})

const MenuButton = styled(Button)<{ component?: React.ElementType }>(() => ({  
  color: '#FDF8F5',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}))

const LoginButton = styled(Button)(() => ({
  backgroundColor: '#936639',
  color: '#FDF8F5',
  padding: '8px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#45a049'
  }
}))

const Header = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!token && !!user)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/')
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleMenuClose()
    navigate('/profile')
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/login')
  }

  return (
    <StyledAppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar sx={{ height: '80px', minHeight: '80px !important' }}>
          {/* Logo */}
          <LogoContainer onClick={() => scrollToSection('home')}>
            <Logo 
              src={logo}
              alt="E Coffee"
            />
            <BrandName>
              E Coffee 
            </BrandName>
          </LogoContainer>

          {/* Menu Items */}
          <MenuContainer>
            <MenuButton onClick={() => scrollToSection('home')}>
              Home
            </MenuButton>
            
            <MenuButton onClick={() => scrollToSection('about')}>
              About
            </MenuButton>

            <MenuButton onClick={() => scrollToSection('offers')}>
              Offers
            </MenuButton>

            <MenuButton onClick={() => scrollToSection('blog')}>
              Blog
            </MenuButton>

            <MenuButton onClick={() => scrollToSection('contact')}>
              Contact
            </MenuButton>

            

          </MenuContainer>

          {/* Icons and Login */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => navigate('/cart')}
              aria-label="shopping cart"
            >
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              sx={{ 
                color: 'white', 
                ml: 2, 
                cursor: isLoggedIn ? 'pointer' : 'default' 
              }}
              onClick={handleMenuOpen}
            >
              <Person />
            </IconButton>

            {!isLoggedIn && (
              <LoginButton
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                Login
              </LoginButton>
            )}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  minWidth: 200,
                  mt: 1
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Thông tin cá nhân" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  )
}

export default Header