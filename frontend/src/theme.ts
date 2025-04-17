import { createTheme, ThemeOptions } from '@mui/material/styles'

const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily: '"Poppins", "Roboto", sans-serif',
          color: '#333333',
          backgroundColor: '#ffffff',
          fontSize: '16px'
        },
        'h1, h2, h3, h4, h5, h6': {
          fontFamily: '"Playfair Display", serif',
          marginBottom: '1rem'
        },
        section: {
          padding: '60px 0'
        },
        '.container': {
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#cab09a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          height: '80px',
          '& .MuiToolbar-root': {
            height: '100%',
            minHeight: '80px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '15px 40px',
          transition: 'all 0.3s ease',
          fontFamily: '"Poppins", sans-serif',
          fontSize: '1.25rem',
          fontWeight: 500,
          minHeight: '50px',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
          },
          '&.btn-gradient': {
            background: 'linear-gradient(135deg, #cab09a 0%, #936639 100%)',
            color: '#fff',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #936639 0%, #582F0E 100%)',
            }
          },
          '&.btn-outline': {
            border: '2px solid #cab09a',
            '&:hover': {
              backgroundColor: 'rgba(202, 176, 154, 0.1)'
            }
          }
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.12)'
          },
          '&.glass-card': {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#936639'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#582F0E'
            },
            '&.glass-input': {
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            },
            '& .MuiOutlinedInput-input': {
              padding: '18px 16px',
              fontSize: '1.25rem'
            }
          },
          '& .MuiInputBase-input': {
            fontSize: '1.1rem',
            padding: '16px 14px',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.glass-effect': {
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }
      }
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#cab09a',
      light: '#e1d5c9',
      dark: '#936639'
    },
    secondary: {
      main: '#582F0E',
      light: '#7b4614',
      dark: '#3e2109'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    },
    background: {
      default: '#ffffff',
      paper: '#f7efe7'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    fontSize: 16,
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '4rem',
      fontWeight: 600,
      marginBottom: '1.5rem'
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3.5rem',
      fontWeight: 600,
      marginBottom: '1.25rem'
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3rem',
      fontWeight: 600,
      marginBottom: '1rem'
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1.25rem'
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '1rem'
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1rem'
    },
    body1: {
      fontSize: '1.25rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '1.1rem',
      lineHeight: 1.5
    },
    button: {
      fontSize: '1.25rem',
      fontWeight: 500
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  spacing: 8
}

const theme = createTheme(themeOptions)

export default theme