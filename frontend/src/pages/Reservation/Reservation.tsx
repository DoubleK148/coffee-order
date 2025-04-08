import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import './Reservation.css'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { createReservation } from '../../services/reservationService'
import { ReservationData } from '../../types'

interface FormData {
  tableId: string;
  date: Date | null;
  time: Date | null;
  guests: number;
  note: string;
  name: string;
  phone: string;
  email: string;
}

const initialFormData: FormData = {
  tableId: '',
  date: new Date(),
  time: new Date(),
  guests: 1,
  note: '',
  name: '',
  phone: '',
  email: ''
};

const Reservation = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Vui lòng chọn ngày và giờ');
      setLoading(false);
      return;
    }

    try {
      const reservationData: ReservationData = {
        tableId: formData.tableId,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time.toLocaleTimeString('en-US', { hour12: false }),
        guests: formData.guests,
        note: formData.note,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        status: 'pending'
      };

      const response = await createReservation(reservationData);
      if (response.success) {
        navigate('/reservations');
      } else {
        setError(response.message || 'Đặt bàn thất bại');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt bàn thất bại');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (formData.name.length < 2) {
      errors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.date) {
      errors.date = 'Vui lòng chọn ngày đặt bàn';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = 'Ngày đặt bàn không thể là ngày trong quá khứ';
      }
    }

    if (!formData.time) {
      errors.time = 'Vui lòng chọn giờ đặt bàn';
    }

    return errors;
  };

  return (
    <Box className="reservation-page">
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
            Đặt bàn
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="reservation-form">
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ tên"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số người"
                      name="guests"
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      inputProps={{ min: 1 }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Ngày đặt bàn"
                        value={formData.date}
                        onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!formErrors.date,
                            helperText: formErrors.date
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Giờ đặt bàn"
                        value={formData.time}
                        onChange={(newValue) => setFormData({ ...formData, time: newValue })}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!formErrors.time,
                            helperText: formErrors.time
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ghi chú"
                      name="note"
                      multiline
                      rows={4}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Đặt bàn'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Reservation 