import React, { useState } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { StructureC04Form } from '../components/forms/StructureC04Form';
import { Button, Typography, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

export function StructureC04() {
  const { getRecords, addRecord, updateRecord, deleteRecord } = useFinancialData();
  const data = getRecords('c04');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const columns = [
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Currency', accessor: 'currency' },
    { header: 'Date', accessor: 'date' },
    { header: 'Category', accessor: 'category' },
    { header: 'Status', accessor: 'status' },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord('c04', id);
    }
  };

  const handleSave = (formData) => {
    if (editingRecord) {
      updateRecord('c04', editingRecord.id, formData);
    } else {
      addRecord('c04', formData);
    }
    setIsModalOpen(false);
  };

  const handleGenerate = () => {
    console.log('Generating export for C04:', data);
    alert('Export generated to console (JSON format).');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Structure C04
         </Typography>
         <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleGenerate}
            >
                Generate
            </Button>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAdd}
            >
                Add Record
            </Button>
         </Box>
      </Box>

      <Table 
        columns={columns} 
        data={data} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Record' : 'New Record'}
      >
        <StructureC04Form
          initialData={editingRecord}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Box>
  );
}
