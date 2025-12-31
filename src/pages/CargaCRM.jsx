import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Alert, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { FileUpload } from '../components/common/FileUpload';
import { crmService } from '../services/crmService';

export function CargaCRM() {
  const [files, setFiles] = useState({
    judicial: null,
    vigente: null,
    clientes: null
  });
  
  const [loading, setLoading] = useState(false);
  const [responseState, setResponseState] = useState(null); // { type: 'success' | 'warning' | 'error', message: '', processed: [], errors: [] }
  const [validationErrors, setValidationErrors] = useState({}); // { key: ["error message"] }

  const handleFileSelect = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    // Clear validation error for this field when user selects a new file
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
    // Optional: Reset main status if needed, or keep it to show previous result
    if (responseState?.type === 'success') {
       setResponseState(null);
    }
  };

  const allFilesSelected = files.judicial && files.vigente && files.clientes;

  const handleUpload = async () => {
    if (!allFilesSelected) return;

    setLoading(true);
    setResponseState(null);
    setValidationErrors({});

    const formData = new FormData();
    formData.append('judicial', files.judicial);
    formData.append('vigente', files.vigente);
    formData.append('clientes', files.clientes);

    try {
      const response = await crmService.uploadFiles(formData);
      
      const { status, message, details, processed, errors } = response.data;

      // HTTP 200 - OK
      if (response.status === 200) {
        setResponseState({
          type: 'success',
          message: message || 'Archivos procesados correctamente.',
          processed: details || [],
          errors: []
        });
      } 
      // HTTP 207 - Multi-Status (Partial Success)
      else if (response.status === 207) {
         setResponseState({
          type: 'warning',
          message: 'Algunos archivos se procesaron, pero otros fallaron.',
          processed: processed || [],
          errors: errors || []
        });
      }

    } catch (error) {
      console.error("Upload error:", error);
      
      if (error.response) {
        // HTTP 400 - Validation Error
        if (error.response.status === 400) {
           setValidationErrors(error.response.data);
           setResponseState({
             type: 'error',
             message: 'Por favor corrija los errores de validación en los archivos.',
             processed: [],
             errors: []
           });
        } 
        // HTTP 500 or others
        else {
           const data = error.response.data;
           setResponseState({
            type: 'error',
            message: data.message || 'Error en el servidor al procesar los archivos.',
            processed: data.processed || [],
            errors: data.errors || (typeof data === 'string' ? [data] : [])
          });
        }
      } else {
        // Network or unexpected error
        setResponseState({
          type: 'error',
          message: 'Error de conexión con el servidor.',
          processed: [],
          errors: [error.message]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fileTypes = [
    { id: 'judicial', label: 'Carga cartera judicial' },
    { id: 'vigente', label: 'Carga cartera vigente' },
    { id: 'clientes', label: 'Carga clientes' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          Carga CRM
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seleccione los 3 archivos requeridos para iniciar el proceso de carga.
        </Typography>
      </Box>

      {/* Global Status Alert */}
      {responseState && (
        <Alert 
          severity={responseState.type} 
          sx={{ mb: 3 }}
          icon={responseState.type === 'warning' ? <WarningIcon /> : undefined}
        >
          <Typography fontWeight="bold">{responseState.message}</Typography>
          
          {(responseState.processed?.length > 0 || responseState.errors?.length > 0) && (
            <Box sx={{ mt: 1 }}>
              {responseState.processed.length > 0 && (
                <Box>
                  <Typography variant="caption" fontWeight="bold">Procesados:</Typography>
                  <List dense disablePadding>
                    {responseState.processed.map((msg, idx) => (
                       <ListItem key={`proc-${idx}`} disablePadding sx={{ pl: 2 }}>
                         <ListItemIcon sx={{ minWidth: 24 }}>
                           <CheckCircleIcon fontSize="small" color="success" />
                         </ListItemIcon>
                         <ListItemText primary={msg} primaryTypographyProps={{ variant: 'caption' }} />
                       </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {responseState.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" fontWeight="bold" color="error">Errores:</Typography>
                   <List dense disablePadding>
                    {responseState.errors.map((msg, idx) => (
                       <ListItem key={`err-${idx}`} disablePadding sx={{ pl: 2 }}>
                         <ListItemIcon sx={{ minWidth: 24 }}>
                           <ErrorIcon fontSize="small" color="error" />
                         </ListItemIcon>
                         <ListItemText primary={msg} primaryTypographyProps={{ variant: 'caption', color: 'error' }} />
                       </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {fileTypes.map((type) => (
          <Grid item xs={12} md={4} key={type.id}>
            <Box>
              <FileUpload
                label={type.label}
                accept=".xlsx"
                selectedFile={files[type.id]}
                onFileSelect={(file) => handleFileSelect(type.id, file)}
              />
              {/* Field-level Validation Errors */}
              {validationErrors[type.id] && (
                <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                  {Array.isArray(validationErrors[type.id]) 
                    ? validationErrors[type.id].join(', ') 
                    : validationErrors[type.id]}
                </Alert>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          disabled={!allFilesSelected || loading}
          onClick={handleUpload}
          sx={{ px: 4, py: 1.5 }}
        >
          {loading ? 'Subiendo...' : 'Subir archivos'}
        </Button>
      </Box>
    </Box>
  );
}
