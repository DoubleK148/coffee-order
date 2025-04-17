import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material'
import { getAdminProductById, updateProduct, Product } from '../../../services/productService'

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
  isBestSeller: boolean
}

const EditProduct = () => {
  const { id } = useParams()
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
    isBestSeller: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [currentImage, setCurrentImage] = useState('')

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const product = await getAdminProductById(id);
      console.log('Fetched product:', product);
      setFormData({
        name: product.name,
        description: product.description,
        image: null,
        category: product.category,
        price: product.price,
        discountPrice: product.discountPrice,
        status: product.status,
        ingredients: product.ingredients || [],
        preparationTime: product.preparationTime,
        calories: product.calories,
        isBestSeller: product.isBestSeller
      });
      setCurrentImage(product.image);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isBestSeller', formData.isBestSeller ? 'true' : 'false');
      
      // Optional fields
      if (formData.discountPrice !== undefined) {
        formDataToSend.append('discountPrice', formData.discountPrice.toString());
      }
      if (formData.preparationTime !== undefined) {
        formDataToSend.append('preparationTime', formData.preparationTime.toString());
      }
      if (formData.calories !== undefined) {
        formDataToSend.append('calories', formData.calories.toString());
      }
      
      // Handle ingredients array
      if (Array.isArray(formData.ingredients) && formData.ingredients.length > 0) {
        formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
      }

      // Handle image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else if (currentImage) {
        formDataToSend.append('keepCurrentImage', 'true');
      }

      console.log('Submitting form data:', {
        ...Object.fromEntries(formDataToSend.entries()),
        image: formData.image ? 'File present' : 'Using current image'
      });

      const updatedProduct = await updateProduct(id!, formDataToSend);
      console.log('Product updated successfully:', updatedProduct);
      
      setSuccess('Cập nhật sản phẩm thành công!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Không thể cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Chỉnh sửa sản phẩm
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên sản phẩm"
          margin="normal"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <TextField
          fullWidth
          label="Mô tả"
          margin="normal"
          multiline
          rows={4}
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={formData.category}
            label="Danh mục"
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          >
            <MenuItem value="coffee">Cà phê</MenuItem>
            <MenuItem value="tea">Trà</MenuItem>
            <MenuItem value="smoothie">Sinh tố</MenuItem>
            <MenuItem value="food">Đồ ăn</MenuItem>
            <MenuItem value="dessert">Tráng miệng</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Giá"
          margin="normal"
          type="number"
          value={formData.price}
          onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
          required
        />

        <TextField
          fullWidth
          label="Giá khuyến mãi"
          margin="normal"
          type="number"
          value={formData.discountPrice || ''}
          onChange={e => setFormData(prev => ({ ...prev, discountPrice: e.target.value ? Number(e.target.value) : undefined }))}
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

        {/* Hiển thị ảnh hiện tại */}
        {currentImage && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ảnh hiện tại:
            </Typography>
            <img
              src={currentImage || '/default-image.jpg'}
              alt="Current product"
              style={{ width: 200, height: 200, objectFit: 'cover' }}
              onError={(e) => {
                console.error(`Failed to load image: ${currentImage}`);
                e.currentTarget.src = '/default-image.jpg';
              }}
            />
          </Box>
        )}

        {/* Input để upload ảnh mới */}
        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setFormData(prev => ({ ...prev, image: file }))
              }
            }}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span">
              {currentImage ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
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
              Đang lưu...
            </>
          ) : 'Lưu thay đổi'}
        </Button>
      </form>
    </Paper>
  )
}

export default EditProduct