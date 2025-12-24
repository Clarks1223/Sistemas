import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getValue = (path) => {
      if (path === '/') return 0;
      if (path.startsWith('/c04')) return 1;
      if (path.startsWith('/i01')) return 2;
      if (path.startsWith('/i02')) return 3;
      return 0;
  }

  const [value, setValue] = React.useState(getValue(location.pathname));

  React.useEffect(() => {
    setValue(getValue(location.pathname));
  }, [location.pathname]);

  return (
    <Paper 
        sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1100,
            display: { xs: 'block', md: 'none' } 
        }} 
        elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          const paths = ['/', '/c04', '/i01', '/i02'];
          navigate(paths[newValue]);
        }}
      >
        <BottomNavigationAction label="Dash" icon={<DashboardIcon />} />
        <BottomNavigationAction label="C04" icon={<StorageIcon />} />
        <BottomNavigationAction label="I01" icon={<TrendingUpIcon />} />
        <BottomNavigationAction label="I02" icon={<SecurityIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
