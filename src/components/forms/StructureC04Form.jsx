import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Box,
  Typography
} from '@mui/material';

// Helper to convert DD/MM/YYYY to YYYY-MM-DD for input fields
const toInputDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 10) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Helper to convert YYYY-MM-DD to DD/MM/YYYY for storage
const toStorageDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const initialFormState = {
  idType: '',
  idNumber: '',
  operationNumber: '',
  assetCode: '',
  assetType: '',
  issuer: '',
  issueDate: '',
  maturityDate: '',
  nominalValue: '',
  accountingDate: '',
  bookValue: '',
  lastAppraisalValue: '',
  provisionValue: '',
  realizationDate: '',
  realizationValue: '',
  recordStatus: 'A', // Default to Active (1 char)
};

export function StructureC04Form({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Convert formatted dates to input friendly dates for editing
      const formattedData = {
          ...initialData,
          issueDate: toInputDate(initialData.issueDate),
          maturityDate: toInputDate(initialData.maturityDate),
          accountingDate: toInputDate(initialData.accountingDate),
          realizationDate: toInputDate(initialData.realizationDate),
      };
      setFormData(formattedData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.idType || formData.idType.length !== 1) newErrors.idType = 'Must be exactly 1 character';
    if (!formData.idNumber || formData.idNumber.length > 15 || /\s/.test(formData.idNumber)) newErrors.idNumber = 'Max 15 chars, no spaces';
    if (!formData.operationNumber || formData.operationNumber.length > 32) newErrors.operationNumber = 'Max 32 chars';
    if (!formData.assetCode || formData.assetCode.length > 20) newErrors.assetCode = 'Max 20 chars';
    if (!formData.assetType || formData.assetType.length !== 3) newErrors.assetType = 'Must be exactly 3 characters';
    if (!formData.accountingDate) newErrors.accountingDate = 'Required';
    if (!formData.bookValue || parseFloat(formData.bookValue) < 0) newErrors.bookValue = 'Required, >= 0';
    if (!formData.provisionValue || parseFloat(formData.provisionValue) < 0) newErrors.provisionValue = 'Required, >= 0';
    if (!formData.recordStatus || formData.recordStatus.length !== 1) newErrors.recordStatus = 'Must be exactly 1 character';

    // Optional validations
    if (formData.issuer && formData.issuer.length > 40) newErrors.issuer = 'Max 40 chars';
    if (formData.maturityDate && formData.issueDate && new Date(formData.maturityDate) < new Date(formData.issueDate)) {
        newErrors.maturityDate = 'Cannot be before Issue Date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        // Convert internal dates (YYYY-MM-DD) back to storage format (DD/MM/YYYY)
        const submissionData = {
            ...formData,
            issueDate: toStorageDate(formData.issueDate),
            maturityDate: toStorageDate(formData.maturityDate),
            accountingDate: toStorageDate(formData.accountingDate),
            realizationDate: toStorageDate(formData.realizationDate),
            // Ensure numerics are stored as numbers if needed, or keep as strings depending on backend expectation. 
            // JSON example used numbers, so let's convert numeric strings.
            nominalValue: formData.nominalValue ? parseFloat(formData.nominalValue) : 0,
            bookValue: parseFloat(formData.bookValue),
            lastAppraisalValue: formData.lastAppraisalValue ? parseFloat(formData.lastAppraisalValue) : 0,
            provisionValue: parseFloat(formData.provisionValue),
            realizationValue: formData.realizationValue ? parseFloat(formData.realizationValue) : 0,
        };

        onSubmit(submissionData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>* Required fields</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Tipo Id *"
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                error={!!errors.idType}
                helperText={errors.idType}
                inputProps={{ maxLength: 1 }}
                placeholder="e.g. C"
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="No. Id *"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
                inputProps={{ maxLength: 15 }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="No. Préstamo *"
                name="operationNumber"
                value={formData.operationNumber}
                onChange={handleChange}
                error={!!errors.operationNumber}
                helperText={errors.operationNumber}
                inputProps={{ maxLength: 32 }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Código Bien *"
                name="assetCode"
                value={formData.assetCode}
                onChange={handleChange}
                error={!!errors.assetCode}
                helperText={errors.assetCode}
                inputProps={{ maxLength: 20 }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Tipo Bien *"
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                error={!!errors.assetType}
                helperText={errors.assetType}
                inputProps={{ maxLength: 3 }}
                placeholder="e.g. BND"
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Emisor"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                error={!!errors.issuer}
                helperText={errors.issuer}
                inputProps={{ maxLength: 40 }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Fecha de Emisión"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Fecha Vencimiento"
                name="maturityDate"
                type="date"
                value={formData.maturityDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.maturityDate}
                helperText={errors.maturityDate}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Valor Nominal"
                name="nominalValue"
                type="number"
                value={formData.nominalValue}
                onChange={handleChange}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Fecha Contabilización *"
                name="accountingDate"
                type="date"
                value={formData.accountingDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.accountingDate}
                helperText={errors.accountingDate}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Valor en Libros *"
                name="bookValue"
                type="number"
                value={formData.bookValue}
                onChange={handleChange}
                required
                error={!!errors.bookValue}
                helperText={errors.bookValue}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Valor Último Avalúo"
                name="lastAppraisalValue"
                type="number"
                value={formData.lastAppraisalValue}
                onChange={handleChange}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Valor Provisión *"
                name="provisionValue"
                type="number"
                value={formData.provisionValue}
                onChange={handleChange}
                required
                error={!!errors.provisionValue}
                helperText={errors.provisionValue}
                variant="outlined"
            />
        </Grid>
         <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Fecha Realización"
                name="realizationDate"
                type="date"
                value={formData.realizationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Valor Realización"
                name="realizationValue"
                type="number"
                value={formData.realizationValue}
                onChange={handleChange}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Estado *"
                name="recordStatus"
                value={formData.recordStatus}
                onChange={handleChange}
                error={!!errors.recordStatus}
                helperText={errors.recordStatus || "Must be 1 char (e.g. A, I)"}
                inputProps={{ maxLength: 1 }}
                variant="outlined"
            />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="outlined" onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Update Record' : 'Create Record'}
        </Button>
      </Box>
    </Box>
  );
}
