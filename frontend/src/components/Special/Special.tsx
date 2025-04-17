import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material'
import './Special.css'
import { useState, useEffect } from 'react'
import { getProducts } from '../../services/productService'
import { useNavigate } from 'react-router-dom'

interface SpecialItem {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

const Special = () => {
  const [specialItems, setSpecialItems] = useState<SpecialItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSpecialItems = async () => {
      try {
        const products = await getProducts()
        // Lọc ra các món đặc biệt (có thể thay đổi logic lọc tùy theo yêu cầu)
        const special = products.filter(product => product.isBestSeller).slice(0, 4)
        setSpecialItems(special)
      } catch (error) {
        console.error('Error fetching special items:', error)
      }
    }

    fetchSpecialItems()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Box id="special" className="special-container">
      <Container>
        <Typography variant="h2" component="h1" className="special-title" gutterBottom>
          Món Đặc Biệt
        </Typography>
        <Typography variant="subtitle1" className="special-subtitle" gutterBottom>
          Khám phá những món đặc biệt của chúng tôi
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {specialItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item._id}>
              <Card className="special-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  className="special-image"
                />
                <CardContent className="special-content">
                  <Typography variant="h6" component="h3" className="special-item-title">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="special-description">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" className="special-price">
                    {formatCurrency(item.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/menu')}
            className="view-all-button"
          >
            Xem Tất Cả Menu
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Special 