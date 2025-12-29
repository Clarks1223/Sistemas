import { useState } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { InversionesForm } from '../components/forms/InversionesForm';
import { Button, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';

export function StructureI01() {
  const { getRecords, addRecord, updateRecord, deleteRecord } = useFinancialData();
  const data = getRecords('i01');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleGenerate = () => {
    console.log('Generating export for I01:', data);
    alert('Export generated to console (JSON format).');
  };

  const handleSaveRecord = (formData) => {
    if (editingRecord) {
      updateRecord('i01', editingRecord.id, formData);
    } else {
      addRecord('i01', formData);
    }
    closeModal();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteRecord('i01', id);
    }
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingRecord(null);
    setIsModalOpen(false);
  };

  const columns = [
    { header: 'Instrumento No.', accessor: 'instrumentNumber' },
    { header: 'Tipo ID Emisor', accessor: 'issuerIdType' },
    { header: 'ID Emisor', accessor: 'issuerId' },
    { header: 'Fecha Emisión', accessor: 'issueDate' },
    { header: 'Fecha Compra', accessor: 'purchaseDate' },
    { header: 'Tipo Instrumento', accessor: 'instrumentType' },
    { header: 'País Emisor', accessor: 'issuerCountry' },
    { header: 'Valor Nominal USD', accessor: 'nominalValueUsd' },
    { header: 'Valor Compra USD', accessor: 'purchaseValueUsd' },
    { header: 'Días Pago Cupón', accessor: 'couponPaymentPeriodDays' },
    { header: 'Clasificación Emisor', accessor: 'issuerClassification' },
    { header: 'Tipo Emisor', accessor: 'issuerType' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Structure I01
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
                onClick={openAddModal}
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
        onClose={closeModal}
        title={editingRecord ? "Editar Inversión" : "Nueva Inversión"}
      >
        <InversionesForm 
          onSubmit={handleSaveRecord}
          onCancel={closeModal}
          structure="i01"
          initialData={editingRecord}
          key={editingRecord ? editingRecord.id : 'new'}
        />
      </Modal>
    </Box>
  );
}
