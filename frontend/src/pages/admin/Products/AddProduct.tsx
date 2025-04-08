import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material'
import { createProduct } from '../../../services/productService'

interface ProductFormData {
  name: string
  description: string
  image: File | null
  category: string
  price: number
  discountPrice?: number
  status: 'available' | 'unavailable' | 'coming_soon'
  ingredients: string[]
  preparationTime?: number
  calories?: number
  isSpicy: boolean
  isBestSeller: boolean
}

const AddProduct = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    image: null,
    category: '',
    price: 0,
    discountPrice: undefined,
    status: 'available',
    ingredients: [],
    preparationTime: undefined,
    calories: undefined,
    isSpicy: false,
    isBestSeller: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isBestSeller', formData.isBestSeller.toString());
      
      // Append optional fields if they exist
      if (formData.discountPrice) {
        formDataToSend.append('discountPrice', formData.discountPrice.toString());
      }
      if (formData.ingredients.length > 0) {
        formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
      }
      if (formData.preparationTime) {
        formDataToSend.append('preparationTime', formData.preparationTime.toString());
      }
      if (formData.calories) {
        formDataToSend.append('calories', formData.calories.toString());
      }
      
      // Append image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending form data:', Object.fromEntries(formDataToSend.entries()));
      
      const response = await createProduct(formDataToSend);
      setSuccess('Thêm sản phẩm thành công');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Thêm Sản Phẩm Mới
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Tên sản phẩm"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          rows={4}
          label="Mô tả"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={formData.category}
            label="Danh mục"
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <MenuItem value="coffee">Cà phê</MenuItem>
            <MenuItem value="tea">Trà/Trà sữa</MenuItem>
            <MenuItem value="other">Thức uống khác</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          label="Giá"
          value={formData.price}
          onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
        />

        <TextField
          margin="normal"
          fullWidth
          type="number"
          label="Giá khuyến mãi"
          value={formData.discountPrice || ''}
          onChange={e => setFormData(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={formData.status}
            label="Trạng thái"
            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'available' | 'unavailable' | 'coming_soon' }))}
          >
            <MenuItem value="available">Có sẵn</MenuItem>
            <MenuItem value="unavailable">Hết hàng</MenuItem>
            <MenuItem value="coming_soon">Sắp ra mắt</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span">
              Tải ảnh lên
            </Button>
          </label>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={formData.isBestSeller}
              onChange={e => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
            />
          }
          label="Best Seller"
        />

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Add preview for selected image */}
        {imagePreview && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img 
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
            />
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Đang xử lý...
            </>
          ) : 'Thêm sản phẩm'}
        </Button>
      </Box>
    </Paper>
  )
}

export default AddProduct 