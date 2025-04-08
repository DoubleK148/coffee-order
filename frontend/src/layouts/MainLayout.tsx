import { Box } from '@mui/material';
import { ReactNode } from 'react';
import Header from '../components/Header/Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Box component="main" className="main-content">
        {children}
      </Box>
    </>
  );
}; 