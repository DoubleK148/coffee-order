import { Box, Container, Typography } from '@mui/material'
import './Offers.css'

const Offers = () => {
  return (
    <Box id="offers" className="offers-container">
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Our Offers
        </Typography>
        {/* Thêm nội dung offers */}
      </Container>
    </Box>
  )
}

export default Offers 