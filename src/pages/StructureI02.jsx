import { useState } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { InversionesForm } from '../components/forms/InversionesForm';
import { Button, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';

export function StructureI02() {
  const { getRecords, addRecord, updateRecord, deleteRecord } = useFinancialData();
  const data = getRecords('i02');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleGenerate = () => {
    console.log('Generating export for I02:', data);
    alert('Exportación generada en consola (formato JSON).');
  };

  const handleSaveRecord = (formData) => {
    if (editingRecord) {
      updateRecord('i02', editingRecord.id, formData);
    } else {
      addRecord('i02', formData);
    }
    closeModal();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      deleteRecord('i02', id);
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
    { header: 'Fecha Vencimiento', accessor: 'maturityDate' },
    { header: 'Calif. Riesgo', accessor: 'riskRating' },
    { header: 'Agencia Calif.', accessor: 'ratingAgency' },
    { header: 'Fecha Últ. Calif.', accessor: 'lastRatingDate' },
    { header: 'Cuenta Contable', accessor: 'accountCode' },
    { header: 'Valor Libros USD', accessor: 'bookValueUsd' },
    { header: 'Estado', accessor: 'instrumentStatus' },
    { header: 'Tasa Interés Nom.', accessor: 'nominalInterestRate' },
    { header: 'Interés Devengado', accessor: 'accruedInterestUsd' },
    { header: 'Calif. Riesgo Reg.', accessor: 'regulatoryRiskRating' },
    { header: 'Provisión USD', accessor: 'provisionAmountUsd' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Estructura I02
         </Typography>
         <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleGenerate}
            >
                Generar
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
        title={editingRecord ? "Editar Inversión (I02)" : "Nueva Inversión (I02)"}
      >
        <InversionesForm 
          onSubmit={handleSaveRecord}
          onCancel={closeModal}
          structure="i02"
          initialData={editingRecord}
          key={editingRecord ? editingRecord.id : 'new'}
        />
      </Modal>
    </Box>
  );
}
