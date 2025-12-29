import React from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { Table } from '../components/common/Table';
import { Button, Typography, Box } from '@mui/material';


export function StructureI02() {
  const { getRecords } = useFinancialData();
  const data = getRecords('i02');

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Compliance Code', accessor: 'code' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography variant="h5" component="h1" fontWeight="bold">
            Structure I02
         </Typography>

      </Box>
      <Table columns={columns} data={data} />
    </Box>
  );
}
