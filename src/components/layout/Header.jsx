import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';

export function Header() {
  return (
    <AppBar 
        position="static" 
        color="inherit" 
        elevation={0} 
        sx={{ borderBottom: '1px solid', borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.secondary', fontWeight: 500 }}>
          Administracion de estructuras de Archivos Area TI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
                Coopcentro
            </Typography>
            <Avatar sx={{ bgcolor: 'primary.light' }}>C</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
