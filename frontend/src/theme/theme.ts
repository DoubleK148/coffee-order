import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: 80,
        },
      },
    },
  },
}); 