import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import CloseIcon from '@mui/icons-material/Close';
import SortableItem from './SortableItem';

const Rearrange = ({ open, onClose, slides, onRearrange }) => {
    const [localSlides, setLocalSlides] = useState(slides);

    useEffect(() => {
        setLocalSlides(slides);
    }, [slides]);     

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = localSlides.findIndex(slide => slide.id.toString() === active.id);
            const newIndex = localSlides.findIndex(slide => slide.id.toString() === over.id);
            
            const reorderedSlides = arrayMove(localSlides, oldIndex, newIndex);
            setLocalSlides(reorderedSlides);
        }
    };    

    const handleCloseModal = () => {
        onRearrange(localSlides); 
        onClose(); 
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2, width: '50vw', maxHeight: '80vh', overflow: 'auto', position: 'relative' }}>
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" align="center" gutterBottom>
                        Re-arrange Slides
                    </Typography>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={localSlides && localSlides.map((slide) => slide.id.toString())} strategy={rectSortingStrategy}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, 100px)',
                                    gap: 2,
                                    justifyContent: 'center',
                                }}
                            >
                                {localSlides && localSlides.map((slide) => {
                                    const originalIndex = slides.findIndex(originalSlide => originalSlide.id === slide.id);

                                    return (
                                        <SortableItem
                                            key={slide.id.toString()}
                                            id={slide.id.toString()}
                                            index={originalIndex}  
                                            backgroundStyle={{
                                                background: slide.backgroundStyle.includes('url(')
                                                    ? `center / cover no-repeat ${slide.backgroundStyle}`
                                                    : slide.backgroundStyle,
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </SortableContext>
                    </DndContext>
                </Box>
            </Box>
        </Modal>
    );
};

export default Rearrange;
