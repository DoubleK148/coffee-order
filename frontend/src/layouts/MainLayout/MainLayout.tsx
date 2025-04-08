import { Box } from '@mui/material'
import { ReactNode } from 'react'
import Header from '../../components/Header/Header'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          paddingTop: '0px', // Chiều cao của header
          minHeight: 'calc(100vh - 50px)' 
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout 