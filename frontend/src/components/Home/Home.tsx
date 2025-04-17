import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Carousel from 'react-material-ui-carousel'
import About from '../About/About'
import Special from '../Special/Special'
import Blog from '../Blog/Blog'
import Contact from '../Contact/Contact'
import imghome1 from '../../assets/imghome1.jpg'
import imghome2 from '../../assets/imghome2.jpg'
import imghome3 from '../../assets/imghome3.jpg'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const images = [
    imghome1,
    imghome2,
    imghome3,
  ]

  return (
    <>
      <Box id="home" className="home-container">
        <Box className="carousel-container">
          <Carousel
            animation="fade"
            interval={5000}
            indicators={true}
            navButtonsAlwaysVisible={true}
            className="carousel"
            indicatorContainerProps={{
              style: {
                position: 'absolute',
                bottom: '40px',
                zIndex: 1,
              }
            }}
            indicatorIconButtonProps={{
              style: {
                padding: '5px',
                color: 'white'
              }
            }}
            activeIndicatorIconButtonProps={{
              style: {
                backgroundColor: 'white',
                color: 'white'
              }
            }}
          >
            {images.map((img, index) => (
              <Box 
                key={index}
                className="slide"
                style={{ backgroundImage: `url(${img})` }}
              >
                <Box className="content">
                  <Typography variant="h1" className="title">
                    Live Your Best Coffee Life
                  </Typography>
                  <Typography variant="h5" className="subtitle">
                    We Don't Make Your Coffee. We Make Your Day.
                  </Typography>
                  <Box className="buttons">
                    <Button 
                      variant="contained" 
                      className="action-button view-menu"
                      onClick={() => navigate('/menu')}
                    >
                      View Menu
                    </Button>
                    <Button 
                      variant="outlined" 
                      className="action-button book-table"
                      onClick={() => navigate('/dat-ban')}
                    >
                      Book Table
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Carousel>
        </Box>
      </Box>
      
      <About />
      <Special />
      <Blog />
      <Contact />
    </>
  )
}

export default Home