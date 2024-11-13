import React from 'react';
import { Modal, Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const RevisionHistory = ({ open, onClose, history, onRestore }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, width: '80vw', maxHeight: '80vh', overflow: 'auto' }}>
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
                                <Button variant="outlined" onClick={() => onRestore(version.slides)}>Restore</Button>
                            </ListItem>
                        ))}
                    </List>
                    <Button onClick={onClose} variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RevisionHistory;
