import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Restaurant as ProductIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  ExitToApp as LogoutIcon,
  EventSeat as EventSeatIcon,
  TableRestaurant as TableRestaurantIcon,
  Menu as HamburgerIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import './AdminLayout.css'
import { logout } from '../../services/authService'

const drawerWidth = 240

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Danh sách sản phẩm', icon: <ProductIcon />, path: '/admin/products' },
    { text: 'Quản lý Đơn hàng', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Quản lý đặt bàn', icon: <EventSeatIcon />, path: '/admin/reservations' },
    { text: 'Quản lý Người dùng', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Quản lý bàn', icon: <TableRestaurantIcon />, path: '/admin/tables' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box className="admin-layout">
      <Drawer
        variant="permanent"
        className="admin-drawer"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" className="admin-content">
        {children}
      </Box>
    </Box>
  )
}

export default AdminLayout