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

  const idTypeMap = {
    'C': 'CÉDULA',
    'R': 'RUC',
    'P': 'PASAPORTE',
    'F': 'REFUGIADO',
    'X': 'EXTRANJERO'
  };

  const assetTypeMap = {
    '110': 'TERRENOS',
    '120': 'EDIFICACIONES',
    '240': 'UNIDADES DE TRANSPORTE',
    '230': 'MAQUINARIA Y EQUIPOS',
    '350': 'ACCIONES Y PARTICIPACIONES',
    '250': 'OTROS'
  };

  const recordStatusMap = {
    'N': 'NUEVO',
    'A': 'ACTUALIZACIÓN',
    'X': 'SUSTITUCIÓN DE GARANTÍA',
    'T': 'SUSTITUCIÓN DE GARANTE / CODEUDOR (GT)',
    'E': 'ELIMINACIÓN (TARJETA DE CRÉDITO)',
    'D': 'HABILITADA / DESBLOQUEADA (TARJETA DE CRÉDITO)',
    'R': 'REPOSICIÓN (TARJETA DE CRÉDITO)',
    'S': 'APLICACIÓN RESOLUCIÓN JPRF F-2024-0123 (TARJETA DE CRÉDITO)'
  };


  const columns = [
    { header: 'Tipo Id', accessor: 'idType', render: (row) => idTypeMap[row.idType] || row.idType },
    { header: 'No. Id', accessor: 'idNumber' },
    { header: 'No. préstamo', accessor: 'operationNumber' },
    { header: 'Código bien', accessor: 'assetCode' },
    { header: 'Tipo bien', accessor: 'assetType', render: (row) => assetTypeMap[row.assetType] || row.assetType },
    { header: 'Emisor', accessor: 'issuer' },
    { header: 'Fecha de emisión', accessor: 'issueDate' },
    { header: 'Fecha vencimiento', accessor: 'maturityDate' },
    { header: 'Valor nominal', accessor: 'nominalValue' },
    { header: 'Fecha contabilización', accessor: 'accountingDate' },
    { header: 'Valor en libros', accessor: 'bookValue' },
    { header: 'Valor último avalúo', accessor: 'lastAppraisalValue' },
    { header: 'Valor provisión', accessor: 'provisionValue' },
    { header: 'Fecha realización', accessor: 'realizationDate' },
    { header: 'Valor realización', accessor: 'realizationValue' },
    { header: 'Estado', accessor: 'recordStatus', render: (row) => recordStatusMap[row.recordStatus] || row.recordStatus },
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
    if (confirm('¿Estás seguro de eliminar este registro?')) {
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
    alert('Exportación generada en consola (formato JSON).');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Estructura C04
         </Typography>
         <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleGenerate}
            >
                Generar
            </Button>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAdd}
            >
                Agregar Registro
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
        title={editingRecord ? 'Editar Registro' : 'Nuevo Registro'}
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
