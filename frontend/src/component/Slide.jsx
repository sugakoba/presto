import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorizeIcon from '@mui/icons-material/Colorize';
import BackgroundPicker from './BackgroundPicker';
import {
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
const SlideBox = styled(Box)`
    position: relative;
    width: 75%;
    aspect-ratio: 16 / 9;
    background-color: white;
    background-size: cover;        
    background-repeat: no-repeat;  
    background-position: center;   
    border: 1px solid #dadada;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    margin-top: 0;
    opacity: ${(props) => (props.fade ? 0 : 1)};
    transition: opacity 0.5s ease-in-out;
`;

const SlideNumber = styled(Box)`
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    color: #000;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
`;

const TextElement = styled(Box)`
    position: absolute;
    text-align: left;
    line-height: 1;
    border: 1px solid #c0c0c0;
    padding: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
`;

export const AddElementContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50vw;
    height: 70vh;
    background-color: #fff;
    box-shadow: 24;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow-y: auto;
    padding-top: 100px;
`;

const AddElementTitle = styled(Typography)`
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding-bottom: 20px;
`;

const AddElementInput = styled(TextField)({
    width: '200px',
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#C46243', 
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#C46243', 
    },
});

const SaveButton = styled(Button)`
    background-color: #C46243;
    box-shadow: none;
    text-transform: none;
`;

const CancelButton = styled(Button)`
    border-color: #C46243;
    color: #C46243;
    box-shadow: none;
    text-transform: none;
    margin-left: 10px;
`;


const Slide = ({ fade, currentSlideIndex, slides, presentation, updatePresentationBackend, setPresentation }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const currentSlide = slides[currentSlideIndex];
    const [backgroundStyle, setBackgroundStyle] = useState(currentSlide?.backgroundStyle || 'white');
    const [isTextEditModalOpen, setTextEditModalOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState({});

    const handleOpenPicker = () => {
        setIsPickerOpen(true);
    };

    const handleClosePicker = () => {
        setIsPickerOpen(false);
    };

    const handleCloseTextEdit = () => {
        setTextEditModalOpen(false);
    }

    const handleElementEdit = (element) => {
        setTextEditModalOpen(true);
        setSelectedElement(element);
        console.log(element)
    }

    const handleElementChange = (field, value) => {
        setSelectedElement((prev) => ({...prev, [field]: value}))
    }

    const handleElementSave = () => {
        //TODO
        setTextEditModalOpen(false);
    }

    
    const handleElementDelete = (element) => {

    }

    const handleBackgroundChange = (style, isDefault) => {
        setBackgroundStyle(style);
        if (isDefault) {
            const updatedSlides = slides.map((slide) => ({
                ...slide,
                backgroundStyle: style,
            }));
            const updatedPresentation = { ...presentation, defaultStyle: style, slides: updatedSlides };
            updatePresentationBackend(updatedPresentation);
            setPresentation(updatedPresentation);
        } else {
            const updatedSlides = slides.map((slide, index) =>
                index === currentSlideIndex ? { ...slide, backgroundStyle: style } : slide
            );
            const updatedPresentation = { ...presentation, slides: updatedSlides };
            updatePresentationBackend(updatedPresentation);
            setPresentation(updatedPresentation);
        }
        handleClosePicker();
    };


    return (
        <>
            <SlideBox 
                fade={fade} 
                sx={{
                    background: currentSlide.backgroundStyle.includes('url(') ? `center / cover no-repeat ${currentSlide.backgroundStyle}` : currentSlide.backgroundStyle
                }}
            >

                {currentSlide.elements.map((element) => (
                    <TextElement
                        key={element.id}
                        onDoubleClick={() => handleElementEdit(element)}
                        style={{
                            top: element.ypos,
                            left: element.xpos,
                            height: `${element.height}%`,
                            width: `${element.width}%`,
                            fontSize: `${element.size}em`,
                            color: element.color,
                            zIndex: element.id,
                        }}
                    >
                        {element.text}
                    </TextElement>
                ))}

                <IconButton 
                    onClick={handleOpenPicker}
                    sx={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', 
                        '&:hover': {
                            backgroundColor: '#fbf1d7',
                        }
                    }} >
                    <ColorizeIcon />
                </IconButton>
                <SlideNumber>
                    <Typography>{currentSlideIndex + 1}</Typography>
                </SlideNumber>
            </SlideBox>
            <BackgroundPicker
                isOpen={isPickerOpen}
                onClose={handleClosePicker}
                onBackgroundChange={handleBackgroundChange}
            />

            <Modal open={isTextEditModalOpen} onClose={handleCloseTextEdit}>
                <AddElementContainer>
                    <AddElementTitle variant="h5" component="h2">
                        Edit this Text
                    </AddElementTitle>
                    <AddElementInput 
                        required
                        value={selectedElement?.height || ''}
                        onChange={(e) => handleElementChange('height', e.target.value)}
                        label="Edit Text Area Height"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={selectedElement?.width || ''}
                        onChange={(e) => handleElementChange('width', e.target.value)}
                        label="Edit Text Area Width"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={selectedElement?.text || ''}
                        onChange={(e) => handleElementChange('text', e.target.value)}
                        label="Edit New Text Content"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={selectedElement?.size || ''}
                        onChange={(e) => handleElementChange('size', e.target.value)}
                        label="Edit New Text Size In em"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={selectedElement?.color || ''}
                        onChange={(e) => handleElementChange('color', e.target.value)}
                        label="Edit New Text Color"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={String(selectedElement?.xpos) || ''}
                        onChange={(e) => handleElementChange('xpos', e.target.value)}
                        label="Edit X-coordinate"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={String(selectedElement?.ypos) || ''}
                        onChange={(e) => handleElementChange('ypos', e.target.value)}
                        label="Edit Y-coordinate"
                        variant="outlined"
                        margin="normal"
                    />
                    <div>
                        <SaveButton variant="contained" onClick={handleElementSave} startIcon={<CheckIcon />}>
                            Save
                        </SaveButton>
                        <CancelButton variant="outlined" onClick={handleCloseTextEdit} startIcon={<CloseIcon />}>
                            Cancel
                        </CancelButton>
                    </div>
                        
                </AddElementContainer>
            </Modal>
            </>
    );
};

export default Slide;
