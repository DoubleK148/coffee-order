import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getAllReservations, updateReservation, deleteReservation, Reservation } from '../../../services/reservationService';
import { handleError } from '../../../services/errorHandler';
import axios from 'axios';

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching reservations...');
      const response = await getAllReservations();
      console.log('Response received:', response);
      
      if (!response) {
        console.error('Response is undefined');
        setError('Không nhận được phản hồi từ server');
        return;
      }

      if (response.success && response.data?.reservations) {
        console.log('Reservations loaded:', response.data.reservations);
        setReservations(response.data.reservations);
      } else {
        console.error('Response indicates failure:', response);
        setError(response.message || 'Không thể tải danh sách đặt bàn');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null
      });
      setError(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      setError(null);
      const response = await updateReservation(id, { status: newStatus });
      if (response.success) {
        await fetchReservations();
      } else {
        setError(response.message || 'Không thể cập nhật trạng thái đặt bàn');
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      setError(handleError(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
      try {
        setError(null);
        const response = await deleteReservation(id);
        if (response.success) {
          await fetchReservations();
        } else {
          setError(response.message || 'Không thể xóa đặt bàn');
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
        setError(handleError(error));
      }
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý đặt bàn
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {reservations.length === 0 ? (
        <Alert severity="info">Không có đơn đặt bàn nào</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Số khách</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>{reservation.name}</TableCell>
                  <TableCell>
                    <div>{reservation.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {reservation.email}
                    </div>
                  </TableCell>
                  <TableCell>{reservation.guests} người</TableCell>
                  <TableCell>
                    {format(parseISO(reservation.date), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(reservation.time), 'HH:mm', { locale: vi })}
                  </TableCell>
                  <TableCell>{reservation.note || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {reservation.status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                          size="small"
                          title="Xác nhận"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleStatusChange(reservation._id, 'cancelled')}
                          size="small"
                          title="Hủy"
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(reservation._id)}
                      size="small"
                      title="Xóa"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReservationList;