import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog 
        open={isOpen} 
        onClose={onClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
            sx: { borderRadius: 2 }
        }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
            {children}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
