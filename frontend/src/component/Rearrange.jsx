import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDraggable } from './StrictModeDraggable';
import { StrictModeDroppable } from './StrictModeDroppable';
import CloseIcon from '@mui/icons-material/Close';

const Rearrange = ({ open, onClose, slides, onRearrange }) => {
    const [localSlides, setLocalSlides] = useState([]);

    useEffect(() => {
        setLocalSlides(slides);
    }, [slides]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedSlides = Array.from(localSlides);
        const [movedSlide] = reorderedSlides.splice(result.source.index, 1);

        reorderedSlides.splice(result.destination.index, 0, movedSlide);
        onRearrange(reorderedSlides);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2, width: '50vw', maxHeight: '80vh', overflow: 'auto' }}>
                    <IconButton onClick={onClose} variant="contained">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" align="center" gutterBottom>
                        Re-arrange Slides
                    </Typography>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <StrictModeDroppable droppableId="slides" direction="horizontal">
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        justifyContent: 'center',
                                    }}
                                >
                                    {localSlides.map((slide, index) => (
                                        <StrictModeDraggable key={slide.id.toString()} draggableId={slide.id.toString()} index={index}>
                                            {(provided) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{
                                                        width: '100px',
                                                        height: '60px',
                                                        background: slide.backgroundStyle.includes('url(') ? `center / cover no-repeat ${slide.backgroundStyle}` : slide.backgroundStyle,
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontSize: '1.2rem',
                                                        fontWeight: 'bold',
                                                        color: '#333',
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                            )}
                                        </StrictModeDraggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </StrictModeDroppable>
                    </DragDropContext>
                </Box>
            </Box>
        </Modal>
    );
};

export default Rearrange;
