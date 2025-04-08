import { createTheme, ThemeOptions } from '@mui/material/styles'

const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#cab09a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '80px',
          '& .MuiToolbar-root': {
            height: '100%',
            minHeight: '80px'
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
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
}

const theme = createTheme(themeOptions)

export default theme 