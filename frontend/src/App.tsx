import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CircularProgress } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { CartProvider } from '@/contexts/CartContext'
import { jwtDecode as decode } from 'jwt-decode'
import theme from '@/theme'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, lazy, Suspense, useState } from 'react'
import PaymentResult from './pages/Payment/PaymentResult'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { TableProvider } from '@/contexts/TableContext'
import Header from './components/Header/Header'
import Home from '@components/Home/Home'
import About from '@components/About/About'
import Blog from '@components/Blog/Blog'
import Contact from '@components/Contact/Contact'
import Login from '@pages/Login/Login'
import Register from '@pages/Register/Register'
import Profile from '@pages/Profile/Profile'
import PrivateRoute from '@components/common/PrivateRoute'
import UserPrivateRoute from '@components/common/UserPrivateRoute'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import AdminLogin from '@pages/admin/Login/AdminLogin'
import Dashboard from '@pages/admin/Dashboard/Dashboard'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import AddProduct from '@pages/admin/Products/AddProduct'
import ProductList from '@pages/admin/Products/ProductList'
import EditProduct from '@pages/admin/Products/EditProduct'
import UserList from '@pages/admin/Users/UserList'
import EditUser from '@pages/admin/Users/EditUser'
import ReservationList from '@pages/admin/Reservations/ReservationList'
import OrderList from '@pages/admin/Orders/OrderList'
import Cart from '@pages/Cart/Cart'
import Checkout from '@pages/Checkout/Checkout'
import OrderSuccess from '@pages/OrderSuccess/OrderSuccess'
import TableDialog from './components/TableDialog/TableDialog'
import TableManagement from '@pages/admin/Tables/TableManagement'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer/Footer'

// Lazy loaded components
const MenuComponent = lazy(() => import('@pages/Menu/Menu'))
const ReservationComponent = lazy(() => import('@pages/Reservation/Reservation'))

interface DecodedToken {
  exp: number;
  userId: string;
  role: string;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showTableDialog, setShowTableDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      try {
        const decodedToken = decode<DecodedToken>(token);
        if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Chỉ hiển thị dialog chọn bàn khi:
    // 1. User đã đăng nhập
    // 2. Chưa chọn bàn
    // 3. Không phải trang admin
    // 4. Không phải trang login/register
    if (user && 
        !localStorage.getItem('hasSelectedTable') && 
        !location.pathname.startsWith('/admin') &&
        location.pathname !== '/login' &&
        location.pathname !== '/register') {
      setShowTableDialog(true);
    }
  }, [user, location.pathname]);

  const handleDialogClose = () => {
    setShowTableDialog(false);
  };

  // Kiểm tra xem có phải trang admin hoặc trang auth không
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isMainPage = ['/', '/about', '/special', '/blog', '/contact'].includes(location.pathname);

  return (
    <>
      {/* Header hiển thị ở tất cả các trang người dùng */}
      {!isAdminPage && !isAuthPage && <Header />}

      {/* Footer chỉ hiển thị ở các trang chính */}
      {isMainPage && <Footer />}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="reservations" element={<ReservationList />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/edit/:id" element={<EditUser />} />
                <Route path="tables" element={<TableManagement />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route path="/profile" element={
          <UserPrivateRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </UserPrivateRoute>
        } />

        <Route path="/dat-ban" element={
          <UserPrivateRoute>
            <MainLayout>
              <Suspense fallback={<CircularProgress />}>
                <ReservationComponent />
              </Suspense>
            </MainLayout>
          </UserPrivateRoute>
        } />

        {/* Public User Routes */}
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />
        <Route path="/menu" element={
          <>
            <Suspense fallback={<CircularProgress />}>
              <MenuComponent />
            </Suspense>
          </>
        } />
        <Route path="/blog" element={
          <MainLayout>
            <Blog />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />
        <Route path="/cart" element={
          <MainLayout>
            <Cart />
          </MainLayout>
        } />
        <Route path="/checkout" element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        } />
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route path="/order-success" element={
          <MainLayout>
            <OrderSuccess />
          </MainLayout>
        } />
      </Routes>
      {/* Chỉ hiển thị TableDialog khi không phải trang login/register và không phải trang admin */}
      {user && !isAdminPage && !isAuthPage && (
        <TableDialog open={showTableDialog} onClose={handleDialogClose} />
      )}
    </>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <TableProvider>
              <AppContent />
            </TableProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
