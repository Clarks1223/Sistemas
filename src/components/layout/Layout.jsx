import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Logic to handle mobile drawer if needed, but for now we rely on MobileNav for mobile
  // and Sidebar (variant permanent) for desktop. 
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {!isMobile && <Sidebar variant="permanent" open={true} />}
        
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <Header />
            <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', pb: isMobile ? 8 : 3 }}>
                <Outlet />
            </Box>
        </Box>
        
        {isMobile && <MobileNav />}
    </Box>
  );
}
