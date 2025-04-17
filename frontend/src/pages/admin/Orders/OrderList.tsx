import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  Paper,
  Typography,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getOrders } from '../../../services/orderService';
import type { Order } from '../../../types/order';

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Thêm state cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  
  // Thêm state cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
      setTotalPages(Math.ceil(data.length / ordersPerPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xử lý lọc và tìm kiếm đơn hàng
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || order.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  // Xử lý phân trang
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Danh sách đơn hàng
      </Typography>

      {/* Thanh tìm kiếm và lọc */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, mã đơn, món..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="preparing">Đang chuẩn bị</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethodFilter}
              label="Phương thức thanh toán"
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="cash">Tiền mặt</MenuItem>
              <MenuItem value="momo">Momo</MenuItem>
              <MenuItem value="card">Thẻ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <List>
        {paginatedOrders.map((order) => (
          <Paper 
            key={order._id} 
            elevation={2} 
            sx={{ 
              mb: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Mã đơn: #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip 
                        label={order.status === 'pending' ? 'Chờ xử lý' :
                              order.status === 'confirmed' ? 'Đã xác nhận' :
                              order.status === 'preparing' ? 'Đang chuẩn bị' :
                              order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        color={order.status === 'completed' ? 'success' :
                               order.status === 'cancelled' ? 'error' :
                               order.status === 'pending' ? 'warning' : 'info'}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Thông tin người đặt */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin người đặt:
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {order.userId?.fullName || 'Không có thông tin người đặt'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {order.userId?.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Danh sách món */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Danh sách món:
                  </Typography>
                  <List dense>
                    {order.items.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {item.quantity}x {item.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography variant="body2">
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Thông tin thanh toán */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      Phương thức thanh toán: {
                        order.paymentMethod === 'cash' ? 'Tiền mặt' :
                        order.paymentMethod === 'momo' ? 'Momo' : 'Thẻ'
                      }
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Tổng tiền: {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Stack>
                </Grid>

                {order.note && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Ghi chú: {order.note}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Paper>
        ))}

        {filteredOrders.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Không có đơn hàng nào
            </Typography>
          </Paper>
        )}
      </List>

      {/* Phân trang */}
      {filteredOrders.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredOrders.length / ordersPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderList;