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
import { useEffect, lazy, Suspense } from 'react'
import PaymentResult from './pages/Payment/PaymentResult'

// User components
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

// Admin pages
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

// New pages
import Cart from '@pages/Cart/Cart'
import Checkout from '@pages/Checkout/Checkout'
import OrderSuccess from '@pages/OrderSuccess/OrderSuccess'

// Lazy loaded components
const MenuComponent = lazy(() => import('@pages/Menu/Menu'))
const ReservationComponent = lazy(() => import('@pages/Reservation/Reservation'))

interface DecodedToken {
  exp: number;
  userId: string;
  role: string;
}

function App() {
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

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CartProvider>
            <CssBaseline />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
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
                <Suspense fallback={<CircularProgress />}>
                  <MenuComponent />
                </Suspense>
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
          </CartProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
