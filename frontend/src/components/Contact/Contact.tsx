import { Box, Container, Typography } from '@mui/material'
import './Contact.css'

const Contact = () => {
  return (
    <Box id="contact" className="contact-container">
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Contact Us
        </Typography>
        {/* Thêm nội dung contact */}
      </Container>
    </Box>
  )
}

export default Contact 