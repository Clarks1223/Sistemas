import React, { useRef } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function FileUpload({ label, selectedFile, onFileSelect, accept = ".csv,.xlsx,.xls,.txt" }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        border: '1px dashed', 
        borderColor: selectedFile ? 'success.main' : 'divider',
        bgcolor: selectedFile ? 'success.light' : 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.3s ease'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {selectedFile ? (
          <CheckCircleIcon color="success" fontSize="large" />
        ) : (
          <UploadFileIcon color="action" fontSize="large" />
        )}
      </Box>

      <Typography variant="subtitle1" fontWeight="medium" align="center">
        {label}
      </Typography>

      {selectedFile && (
        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '200px' }}>
          {selectedFile.name}
        </Typography>
      )}

      <Button 
        variant={selectedFile ? "outlined" : "contained"} 
        color={selectedFile ? "success" : "primary"}
        onClick={handleClick}
        size="small"
      >
        {selectedFile ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
      </Button>
    </Paper>
  );
}
