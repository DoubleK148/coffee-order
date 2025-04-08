import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Restaurant as MenuIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  ExitToApp as LogoutIcon,
  EventSeat as EventSeatIcon,
  TableRestaurant as TableRestaurantIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import './AdminLayout.css'
import { logout } from '../../services/authService'

const drawerWidth = 240

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Danh sách sản phẩm', icon: <MenuIcon />, path: '/admin/products' },
    { text: 'Quản lý Đơn hàng', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Quản lý đặt bàn', icon: <EventSeatIcon />, path: '/admin/reservations' },
    { text: 'Quản lý Người dùng', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Quản lý bàn', icon: <TableRestaurantIcon />, path: '/admin/tables' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
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
            </List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout