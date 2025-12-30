import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Box, 
  Avatar 
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

export function Dashboard() {
  const cards = [
    { title: 'Archivos Cartera', path: '/c04', icon: StorageIcon, desc: 'Carga de archivos de cartera' },
    { title: 'Estructura C04', path: '/c04', icon: StorageIcon, desc: 'Administracion de estructura C04' },
    { title: 'Estructura I01', path: '/i01', icon: TrendingUpIcon, desc: 'Administracion de estructura I01' },
    { title: 'Estructura I02', path: '/i02', icon: SecurityIcon, desc: 'Administracion de estructura I02' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="text.primary">
        Panel Principal
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea component={Link} to={card.path} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mr: 2 }}>
                      <card.icon />
                    </Avatar>
                    <Typography variant="h6" component="h2" fontWeight="600">
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
