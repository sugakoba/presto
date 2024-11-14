import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, TextField, Button, Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackgroundPicker from './BackgroundPicker';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    FontDownload as FontDownloadIcon,
    Colorize as ColorizeIcon
} from '@mui/icons-material';
import hljs from 'highlight.js';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
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
    const [isFontModalOpen, setIsFontModalOpen] = useState(false);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [isImageEditModalOpen, setImageEditModalOpen] = useState(false);
    const [isVideoEditModalOpen, setVideoEditModalOpen] = useState(false);
    const [isCodeEditModalOpen, setCodeEditModalOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState({});

    const [imageInputType, setImageInputType] = useState('url');

    const handleOpenPicker = () => {
        setIsPickerOpen(true);
    };

    const handleClosePicker = () => {
        setIsPickerOpen(false);
    };

    const handleOpenFontModal = () => {
        setIsFontModalOpen(true);
    };

    const handleCloseFontModal = () => {
        setIsFontModalOpen(false);
    };

    const handleCloseTextEdit = () => {
        setTextEditModalOpen(false);
    }

    const handleCloseImageEdit = () => {
        setImageEditModalOpen(false);
    }

    const handleCloseVideoModal = () => {
        setVideoEditModalOpen(false);
    }

    const handleCloseCodeModal = () => {
        setCodeEditModalOpen(false);
    }

    const handleElementEdit = (element) => {
        if (element.type === 'text') {
            setTextEditModalOpen(true);
        } else if (element.type === 'image') {
            setImageEditModalOpen(true);

        } else if (element.type === 'video') {
            setVideoEditModalOpen(true);

        } else if (element.type === 'code') {
            setCodeEditModalOpen(true);
        }
        
        setSelectedElement(element);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleElementChange('url', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleElementChange = (field, value) => {
        setSelectedElement((prev) => ({...prev, [field]: value}))
    }

    const handleElementSave = () => {
        const updatedSlides = slides.map((slide, index) => {
            if (index === currentSlideIndex) {
                const updatedElements = slide.elements.map((element) => 
                    element.id === selectedElement.id ? selectedElement : element
                );
                return { ...slide, elements: updatedElements };
            }
            return slide;
        });
    
        const updatedPresentation = { ...presentation, slides: updatedSlides };
    
        updatePresentationBackend(updatedPresentation);
    
        setPresentation(updatedPresentation);
        setTextEditModalOpen(false);
        setImageEditModalOpen(false);
        setVideoEditModalOpen(false);
        setCodeEditModalOpen(false);
    }

    
    const handleElementDelete = (elementToDelete) => {
        const updatedElements = currentSlide.elements.filter(
            (element) => element.id !== elementToDelete.id
        );
        
        const updatedSlide = { ...currentSlide, elements: updatedElements };
        
        const updatedSlides = slides.map((slide, index) => {
            if (index === currentSlideIndex) {
                return updatedSlide;
            }
            return slide;
        });
    
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        updatePresentationBackend(updatedPresentation);
        setPresentation(updatedPresentation);
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

    const handleFontFamilyChange = (event) => {
        const selectedFont = event.target.value;
        setFontFamily(selectedFont);

        const updatedSlides = slides.map((slide, index) =>
            index === currentSlideIndex
                ? { ...slide, fontFamily: selectedFont }
                : slide
        );

        const updatedPresentation = { ...presentation, slides: updatedSlides };
        updatePresentationBackend(updatedPresentation);
        setPresentation(updatedPresentation);
    };

    return (
        <>
            <SlideBox 
                sx={{
                    opacity: fade ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                    background: currentSlide.backgroundStyle.includes('url(') ? `center / cover no-repeat ${currentSlide.backgroundStyle}` : currentSlide.backgroundStyle
                }}
            >
                <Box sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} >
                    <IconButton 
                        onClick={handleOpenFontModal}
                        sx={{
                            mr: 2,
                            backgroundColor: 'white',
                            width: { xs: 24, sm: 32, md: 40 }, 
                            height: { xs: 24, sm: 32, md: 40 }, 
                            '&:hover': {
                                backgroundColor: '#fbf1d7',
                            }
                        }}
                    >
                        <FontDownloadIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }}/> 
                    </IconButton>
                    
                    <IconButton 
                        onClick={handleOpenPicker}
                        sx={{
                            backgroundColor: 'white',
                            width: { xs: 24, sm: 32, md: 40 },
                            height: { xs: 24, sm: 32, md: 40 },
                            '&:hover': {
                                backgroundColor: '#fbf1d7',
                            }
                        }}
                    >
                        <ColorizeIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }}/> 
                    </IconButton>
                </Box>


                <Modal open={isFontModalOpen} onClose={handleCloseFontModal}>
                    <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, width: '300px', margin: 'auto', mt: '10%', position: 'relative' }}>
                        <IconButton onClick={handleCloseFontModal} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" gutterBottom>Choose Font</Typography>
                        <RadioGroup
                            value={fontFamily}
                            onChange={handleFontFamilyChange}
                        >
                            <FormControlLabel value="Arial" control={<Radio />} label="Arial" />
                            <FormControlLabel value="Roboto" control={<Radio />} label="Roboto" />
                            <FormControlLabel value="Courier New" control={<Radio />} label="Courier New" />
                            <FormControlLabel value="Georgia" control={<Radio />} label="Georgia" />
                            <FormControlLabel value="Helvetica Neue" control={<Radio />} label="Helvetica Neue" />
                        </RadioGroup>
                    </Box>
                </Modal>

                {/* Edit below is required */}
                {currentSlide.elements.map((element) => {
                    const commonStyles = {
                        top: `${element.ypos}%`,
                        left: `${element.xpos}%`,
                        height: `${element.height}%`,
                        width: `${element.width}%`,
                        zIndex: element.id,
                    };

                    if (element.type === "code") {
                        const codingLanguage = hljs.highlightAuto(element.code).language || 'plaintext';
                        return (
                            <TextElement
                                key={element.id}
                                onDoubleClick={() => handleElementEdit(element)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleElementDelete(element);
                                }}
                                sx={{
                                    ...commonStyles,
                                    fontSize: `${element.size}em`,
                                }}
                            >
                                <SyntaxHighlighter
                                    language={codingLanguage}
                                    style={docco}
                                    wrapLongLines
                                >
                                    {element.code}
                                </SyntaxHighlighter>
                            </TextElement>
                        );
                    }

                    return element.type === "text" ? (
                        <TextElement
                            key={element.id}
                            onDoubleClick={() => handleElementEdit(element)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                handleElementDelete(element);
                            }}
                            sx={{
                                ...commonStyles,
                                fontSize: `${element.size}em`,
                                color: element.color,
                                fontFamily: currentSlide.fontFamily
                            }}
                        >
                            {element.text}
                        </TextElement>
                    ) : element.type === "image" ? (
                        <TextElement
                            key={element.id}
                            onDoubleClick={() => handleElementEdit(element)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                handleElementDelete(element);
                            }}
                            sx={commonStyles}
                        >
                            <img
                                src={element.url}
                                alt={element.description}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                        </TextElement>
                    ) : element.type === "video" ? (
                        <TextElement
                            key={element.id}
                            onDoubleClick={() => handleElementEdit(element)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                handleElementDelete(element);
                            }}
                            sx={commonStyles}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`${element.url}?rel=0&modestbranding=1&mute=1&showinfo=0&controls=0&autoplay=${element.autoplay ? 1 : 0}`}
                                allow="autoplay"
                            />
                        </TextElement>
                    ) : null;
                })}

                <SlideNumber sx={{ width: { xs: 24, sm: 32, md: 40 }, height: { xs: 24, sm: 32, md: 40 } }}>
                    <Typography sx={{ fontSize: { xs: 10, sm: 12, md: 14 } }}>{currentSlideIndex + 1}</Typography>
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


            <Modal open={isImageEditModalOpen} onClose={handleCloseImageEdit}>
                <AddElementContainer>
                    <AddElementTitle variant="h5" component="h2">
                        Edit this Image
                    </AddElementTitle>
                    <AddElementInput 
                        required
                        value={selectedElement?.height || ''}
                        onChange={(e) => handleElementChange('height', e.target.value)}
                        label="Edit Image Height"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput 
                        required
                        value={selectedElement?.width || ''}
                        onChange={(e) => handleElementChange('width', e.target.value)}
                        label="Edit Image Width"
                        variant="outlined"
                        margin="normal"
                    />
                    <div sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <RadioGroup
                            row
                            value={imageInputType}
                            onChange={(e) => setImageInputType(e.target.value)}
                        >
                        <FormControlLabel value="url" control={<Radio />} label="Enter Image URL" />
                        <FormControlLabel value="file" control={<Radio />} label="Upload Image File" />
                        </RadioGroup>
                        {imageInputType === 'url' ? (
                            <AddElementInput
                                onChange={(e) => handleElementChange('url', e.target.value)}
                                label="Enter Image URL"
                                variant="outlined"
                                margin="normal"
                                value={selectedElement?.url || ''}
                            />
                        ) : (
                            <Button variant="outlined" component="label" sx={{ marginTop: 2 }} >
                                Upload Image File
                                <input type="file" accept="image/*" hidden onChange={handleFileChange}/>
                            </Button>
                        )}
                    </div>


                    <AddElementInput
                        required
                        onChange={(e) => handleElementChange('description', e.target.value)}
                        label="Enter Alt Description"
                        variant="outlined"
                        margin="normal"
                        value={selectedElement?.description || ''}
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
                        <CancelButton variant="outlined" onClick={handleCloseImageEdit} startIcon={<CloseIcon />}>
                            Cancel
                        </CancelButton>
                    </div>
                        
                </AddElementContainer>
            </Modal>

            <Modal open={isVideoEditModalOpen} onClose={handleCloseVideoModal}>
                <AddElementContainer>
                    <AddElementTitle variant="h5" component="h2">
                        Edit New Video
                    </AddElementTitle>
                    <AddElementInput
                        required
                        value={selectedElement?.height || ''}
                        onChange={(e) => handleElementChange('height', e.target.value)}
                        label="Edit Video Height"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput
                        required
                        value={selectedElement?.width || ''}
                        onChange={(e) => handleElementChange('width', e.target.value)}
                        label="Edit Video Width"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput
                        required
                        value={selectedElement?.url || ''}
                        onChange={(e) => handleElementChange('url', e.target.value)}
                        label="Enter Video URL"
                        variant="outlined"
                        margin="normal"
                    />
                    <div sx={{ display: 'flex', alignItems: 'center' }}>
                        Autoplay?
                        <Checkbox
                            checked={selectedElement.autoplay}
                            onChange={(e) => handleElementChange('autoplay', e.target.checked)}
                            color="primary"
                        />
                    </div>
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
                        <CancelButton variant="outlined" onClick={handleCloseVideoModal} startIcon={<CloseIcon />}>
                            Cancel
                        </CancelButton>
                    </div>
                        
                </AddElementContainer>
            </Modal>

            
            <Modal open={isCodeEditModalOpen} onClose={handleCloseTextEdit}>
                <AddElementContainer>
                    <AddElementTitle variant="h5" component="h2">
                        Edit Code Block
                    </AddElementTitle>
                    <AddElementInput
                        required
                        value={selectedElement.height}
                        onChange={(e) => handleElementChange('height', e.target.value)}
                        label="Edit Code Block Height"
                        variant="outlined"
                        margin="normal"
                    />
                    <AddElementInput
                        required
                        value={selectedElement.width}
                        onChange={(e) => handleElementChange('width', e.target.value)}
                        label="Edit Code Block Width"
                        variant="outlined"
                        margin="normal"
                    />

                    <AddElementInput 
                        required
                        value={selectedElement.size}
                        onChange={(e) => handleElementChange('size', e.target.value)}
                        label="Edit Code Size in em"
                        variant="outlined"
                        margin="normal"
                    />

                    <AddElementInput
                        required
                        value={selectedElement.code}
                        onChange={(e) => handleElementChange('code', e.target.value)}
                        label="Edit Code Block"
                        variant="outlined"
                        margin="normal"
                        multiline
                        minRows={4}
                        fullWidth

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
                        <CancelButton variant="outlined" onClick={handleCloseCodeModal} startIcon={<CloseIcon />}>
                            Cancel
                        </CancelButton>
                    </div>
                    
                </AddElementContainer>
            </Modal>
        
        
        </>
    );
};

export default Slide;
