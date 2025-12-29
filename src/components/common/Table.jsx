import React from 'react';
import { 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function Table({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No hay registros.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <MuiTable sx={{ minWidth: 650 }} aria-label="data table">
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.accessor} sx={{ fontWeight: 600 }}>
                {col.header}
              </TableCell>
            ))}
            {(onEdit || onDelete) && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover
            >
              {columns.map((col) => (
                <TableCell key={col.accessor}>
                  {row[col.accessor]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  {onEdit && (
                    <IconButton onClick={() => onEdit(row)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton onClick={() => onDelete(row.id)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
