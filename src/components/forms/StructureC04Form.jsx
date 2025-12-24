import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Box
} from '@mui/material';

const initialFormState = {
  description: '',
  amount: '',
  date: '',
  category: '',
  accountNumber: '',
  reference: '',
  status: 'Draft',
  currency: 'USD',
};

export function StructureC04Form({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
             <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="Operational">Operational</MenuItem>
              <MenuItem value="Capital">Capital</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
            </Select>
          </FormControl>
        </Grid>
         <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="ACC-12345"
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="REF-001"
                variant="outlined"
            />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
             <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
            >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
             <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                 <Select
                    name="currency"
                    value={formData.currency}
                    label="Currency"
                    onChange={handleChange}
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                </Select>
             </FormControl>
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
