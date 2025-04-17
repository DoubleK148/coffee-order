import { Box, Typography, TextField, Button } from '@mui/material'
import { LocationOn, Phone, Email } from '@mui/icons-material'
import './Contact.css'

const Contact = () => {
  const contactInfo = [
    {
      icon: <LocationOn />,
      content: '123 Đường ABC, Quận XYZ, TP.HCM'
    },
    {
      icon: <Phone />,
      content: '(+84) 123 456 789'
    },
    {
      icon: <Email />,
      content: 'info@ecoffee.com'
    }
  ]

  return (
    <Box id="contact" className="contact-container">
      <Typography variant="h2" component="h1" className="contact-title">
        Contact Us
      </Typography>

      <div className="contact-content">
        <div className="contact-left">
          {/* Contact Info */}
          {contactInfo.map((info, index) => (
            <Box key={index} className="info-card">
              <Box className="info-icon">
                {info.icon}
              </Box>
              <Typography variant="body1" className="info-content">
                {info.content}
              </Typography>
            </Box>
          ))}

          {/* Contact Form */}
          <Box component="form" className="contact-form">
            <TextField
              fullWidth
              label="Họ và tên"
              variant="outlined"
              size="small"
              className="contact-input"
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              size="small"
              className="contact-input"
            />
            <TextField
              fullWidth
              label="Tin nhắn"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              className="contact-input"
            />
            <Button 
              variant="contained"
              className="submit-button"
              fullWidth
            >
              Gửi Tin Nhắn
            </Button>
          </Box>
        </div>

        {/* Right side: Map */}
        <div className="contact-right">
          <Box className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197276!2d106.69765661533417!3d10.778789792319489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xc4b3b6330b02eb89!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1649835364271!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </div>
      </div>
    </Box>
  )
}

export default Contact 