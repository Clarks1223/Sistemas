import React from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { Table } from '../components/common/Table';
import { Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export function StructureI01() {
  const { getRecords } = useFinancialData();
  const data = getRecords('i01');

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Value', accessor: 'value' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Structure I01
         </Typography>
         <Button 
            variant="contained" 
            startIcon={<AddIcon />}
         >
           Add Record
         </Button>
      </Box>
      <Table columns={columns} data={data} />
    </Box>
  );
}
