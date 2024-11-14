import React from 'react';
import { Modal, Box, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import RestorePageIcon from '@mui/icons-material/RestorePage';

const RestoreButton = styled(Button)(({ theme }) => ({
  borderColor: '#C46243',
  color: '#C46243',
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(196, 98, 67, 0.1)', 
    borderColor: '#C46243',
  },
}));

const RevisionHistory = ({ open, onClose, history, onRestore }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, width: '80vw', maxHeight: '80vh', overflow: 'auto', position: 'relative' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" align="center" gutterBottom>
                        Version History
          </Typography>
          <List>
            {history.map((version, index) => (
              <ListItem key={index} button onClick={() => onRestore(version.slides)}>
                <ListItemText 
                  primary={`Version ${index + 1}`}
                  secondary={new Date(version.timestamp).toLocaleString()}
                />
                <RestoreButton variant="outlined" onClick={() => onRestore(version.slides)} startIcon={<RestorePageIcon />}>
                                    Restore
                </RestoreButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default RevisionHistory;
