import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField, IconButton, List, Card, CardContent, Fab, Drawer, ListItemButton, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import axios from 'axios';
import {
    EditOutlined as EditOutlinedIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
    Menu as MenuIcon,
    TextFields as TextIcon,
    VideoCameraBack as VideoIcon,
    Code as CodeIcon,
    Slideshow as SlideshowIcon,
    ExpandMore as ExpandMoreIcon
  } from '@mui/icons-material';
import ErrorPopUp from "../component/ErrorPopUp";
import Slide from "../component/Slide";

const PresentationContainer = styled(Box)`
    background-color: #fbf1d7;
    min-height: 100vh;
    padding-top: 10px;
`;

const TitleContainer = styled(Box)`
    position: absolute;
    display: flex;
    justify-content: center;
    left: 50%;
    align-items: center;
    margin-bottom: 10px;
    transform: translateX(-50%); 
    @media (max-width: 800px) {
        position: static; 
        transform: none;
    }
`;

const ButtonContainer = styled(Box)`
    display: flex;
    justify-content: end;
    margin: 10px;
`;

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

const EditTitleContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50vw;
    height: 50vh;
    background-color: #fff;
    box-shadow: 24;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const EditTitle = styled(Typography)`
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding-bottom: 20px;
`;

const EditName = styled(TextField)({
    width: '213px',
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#C46243', 
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#C46243', 
    },
});

const SlideContainer = styled(Box)`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 80vw;
    flex-grow: 1;
    margin: 0 auto;
    border: 2px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
`;

const SlideListContainer = styled(Box)`
    width: 20vw;
    height: auto;
    overflow-y: auto;
    padding-left: 10px;
    padding-right: 10px;
`;

const SlideCard = styled(Card)`
    margin-bottom: 10px;
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    &.Mui-selected {
        border: 2px solid #3f51b5;
    }
`;

const AddSlideButton = styled(Fab)`
    background-color: #C46243;
    position: absolute; 
    bottom: 20px;
    right: 20px;
`

const ConfirmDelete = styled(Box)`
    padding: 20px;
    background-color: #fff;
    margin: auto;
    width: 300px;
`
const DrawerContent = styled(Box)`
    width: 250px;
    padding: 20px;
`;

const AddElementContainer = styled(Box)`
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

function Presentation({ token }) {
    const [presentation, setPresentation] = useState({});
    const [presentations, setPresentations] = useState([]);
    const { presentationId, slideNumber } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState(presentation.name);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(Number(slideNumber) - 1 || null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [toolExpand, setToolExpand] = useState(true);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const [textAreaHeight, setTextAreaHeight] = useState(0);
    const [textAreaWidth, setTextAreaWidth] = useState(0);
    const [text, setText] = useState('');
    const [textSize, setTextSize] = useState('0');
    const [textColor, setTextColor] = useState('0');

    const handleToolExpand = () => {
        setToolExpand(!toolExpand);
    }

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleOpenModal = () => {
        setNewTitle(title);  
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenTextModal = () => {
        setIsTextModalOpen(true);
    }

    const handleCloseTextModal = () => {
        setIsTextModalOpen(false);
    }

    const handleCloseError = () => {
        setErrorOpen(false);
    }    

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const updateSlideIndex = (index) => {
        setCurrentSlideIndex(index);
        navigate(`/dashboard/${presentationId}/${index + 1}`);
    };

    const updatePresentationBackend = async (updatedPresentation) => {
        try {
            const updatePresentations = presentations.map((presentation) =>
                Number(presentation.id) === Number(presentationId)
                    ? updatedPresentation
                    : presentation
            );
            const response = await axios.put('http://localhost:5005/store', 
                { store: { presentations: updatePresentations } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            if (response.status === 200) {
                setPresentations(updatePresentations);
            }
        } catch (error) {
            setErrorMsg(error.response.data.error);
            setErrorOpen(true);
        }
    };

    /*********************************
    **********************************
    **** Change Slide layout here ****
    **********************************
    **********************************/

    
    const handleNewText = async () => {
        

        const newText = {
            id: presentation.slides[currentSlideIndex].elements.length + 1,
            type: "text",
            height: textAreaHeight,
            width: textAreaWidth,
            text: text,
            size: textSize,
            color: textColor,
            xpos: 0,
            ypos: 0
        }

        const updatedElements = [...presentation.slides[currentSlideIndex].elements, newText];
        const updatedSlides = presentation.slides.map((slide, index) =>
            index === currentSlideIndex
                ? { ...slide, elements: updatedElements }
                : slide
        );

        const updatedPresentation = { ...presentation, slides: updatedSlides };

        setPresentation(updatedPresentation);
        updatePresentationBackend(updatedPresentation);
        handleCloseTextModal();
    };

    const addNewSlide = async () => {
        const newSlide = {
            id: presentation.slides[presentation.slides.length - 1].id + 1,
            backgroundStyle: presentation.defaultStyle,
            elements: []
        };
        const updatedSlides = [...presentation.slides, newSlide];
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        setPresentation(updatedPresentation);
        updateSlideIndex(updatedSlides.length - 1);
        updatePresentationBackend(updatedPresentation);
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < presentation.slides.length - 1) {
            updateSlideIndex(currentSlideIndex + 1);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            updateSlideIndex(currentSlideIndex - 1);
        }
    };

    const handleThumbnailUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                const updatePresentations = presentations.map((presentation) =>
                    Number(presentation.id) === Number(presentationId)
                        ? { ...presentation, thumbnail: base64String }
                        : presentation
                )
        
                try {
                    const response = await axios.put('http://localhost:5005/store', 
                        { store: { presentations: updatePresentations } },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                        }
                    );
                    if (response.status === 200) {
                        setPresentation((prevPresentation) => ({
                            ...prevPresentation,
                            thumbnail: base64String, 
                        }));
                        setPresentations(updatePresentations)
                        setErrorMsg('Image successfully uploaded!');
                        setErrorOpen(true);
                    }
                } catch (error) {
                    setErrorMsg('Failed to save new thumbnail: ', error.response.data.error);
                    setErrorOpen(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const deletePresentation = async () => {
        const afterDeletion = presentations.filter(presentation => Number(presentation.id) !== Number(presentationId));
        try {
            const response = await axios.put('http://localhost:5005/store', 
                { store: { presentations: afterDeletion } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            if (response.status === 200) {
                setPresentations(afterDeletion);
                navigate('/dashboard');
            }
        } catch (error) {
            setErrorMsg('Failed to delete presentation: ', error.response.data.error);
            setErrorOpen(true); 
        }
    };

    const deleteCurrentSlide = () => {
        if (presentation.slides.length === 1) {
            setErrorMsg('Cannot delete the only slide!');
            setErrorOpen(true);
            return;
        }

        const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        setPresentation(updatedPresentation);
        updateSlideIndex(Math.max(currentSlideIndex - 1, 0));
        updatePresentationBackend(updatedPresentation);
    };

    const handleSaveTitle = async () => {
        setTitle(newTitle);   
        const updatePresentations = presentations.map((presentation) =>
                                        Number(presentation.id) === Number(presentationId)
                                            ? { ...presentation, name: newTitle }
                                            : presentation
                                    )
        setIsModalOpen(false); 
              
        try {
            const response = await axios.put('http://localhost:5005/store', 
                { store: { presentations: updatePresentations } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            if (response.status === 200) {
                setPresentation((prevPresentation) => ({
                    ...prevPresentation,
                    name: newTitle, 
                }));
                setPresentations(updatePresentations)
            }
        } catch (error) {
            setErrorMsg('Failed to save new title: ', error.response.data.error);
            setErrorOpen(true);
        }
    };

    const fetchPresentationInfo = async () => {
        try {
            const response = await axios.get('http://localhost:5005/store', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const presentationsData = response.data.store.presentations;
                setPresentations(presentationsData);
                presentationsData.map(presentation => {
                    if (Number(presentation.id) === Number(presentationId)) {
                        setPresentation(presentation);
                        setTitle(presentation.name);
                    }
                })
            }
        } catch (error) {
            setErrorMsg(error.response.data.error);
            setErrorOpen(true);
        }
    };

    const openPreview = () => {
        const slidePreviewNum = (slideNumber || 1);
        window.open(`/dashboard/${presentationId}/preview/${slidePreviewNum}`, "_blank");
    };    

    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
    };

    useEffect(() => {
        fetchPresentationInfo();
    }, []);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (slideNumber !== null && presentation.slides && presentation.slides[Number(slideNumber) - 1]) {
            setCurrentSlideIndex(Number(slideNumber) - 1);
        }
    }, [presentation.slides, slideNumber]);

    return (
        <>
            <PresentationContainer>
                <IconButton 
                    onClick={toggleDrawer(true)} 
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'none', 
                        '@media (max-width: 800px)': {
                            display: 'block', 
                        },
                    }} 
                >
                    <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                    <DrawerContent>
                        <ListItemButton variant="contained" onClick={handleBack} fullWidth>
                            <ListItemIcon>
                                <ArrowBackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Back to Dashboard" />
                        </ListItemButton>
                        <ListItemButton variant="outlined" onClick={handleDeleteClick} fullWidth>
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText primary="Delete" />
                        </ListItemButton>
                        <ListItemButton variant="outlined" onClick={openPreview} fullWidth>
                            <ListItemIcon>
                                <SlideshowIcon />
                            </ListItemIcon>
                            <ListItemText primary="Preview" />
                        </ListItemButton>
                        <ListItemButton variant="outlined" component="label" fullWidth>
                            <ListItemIcon>
                                <ImageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change Thumbnail" />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                            />
                        </ListItemButton>
                    </DrawerContent>
                </Drawer>
                <ButtonContainer 
                    sx={{
                        display: 'flex', 
                        '@media (max-width: 800px)': {
                            display: 'none',
                        },
                    }}
                >
                    <SaveButton variant="contained" onClick={handleBack} startIcon={<ArrowBackIcon />}>
                        Back
                    </SaveButton>
                    <CancelButton variant="outlined" onClick={handleDeleteClick} startIcon={<DeleteIcon />}>
                        Delete
                    </CancelButton>
                </ButtonContainer>
                <TitleContainer>
                    <Typography variant="h4" sx={{ margin: '5px' }}>
                        {title}
                    </Typography>
                    <IconButton onClick={handleOpenModal} aria-label="edit title">
                        <EditOutlinedIcon />
                    </IconButton>
                </TitleContainer>
                <ButtonContainer 
                    sx={{
                        display: 'flex', 
                        '@media (max-width: 800px)': {
                            display: 'none',
                        },
                    }}
                >
                    <SaveButton aria-label="presentation-preview" variant="contained" onClick={openPreview} startIcon={<SlideshowIcon />}>
                        Preview
                    </SaveButton>
                    <CancelButton variant="outlined" component="label" startIcon={<ImageIcon />}>
                        Change Thumbnail
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                        />
                    </CancelButton>
                </ButtonContainer>
                <Modal
                    open={showDeleteConfirmation}
                    onClose={cancelDelete}
                    aria-labelledby="delete-confirmation-title"
                >
                    <ConfirmDelete>
                        <Typography id="delete-confirmation-title" variant="h6">
                            Are you sure?
                        </Typography>
                        <Button onClick={deletePresentation} color="error">
                            Yes
                        </Button>
                        <Button onClick={cancelDelete}>No</Button>
                    </ConfirmDelete>
                </Modal>
                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <EditTitleContainer>
                        <EditTitle variant="h5" component="h2">
                            Edit Title
                        </EditTitle>
                        <EditName
                            required
                            inputRef={inputRef} 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            label="Enter new title"
                            variant="outlined"
                            margin="normal"
                        />
                        <div>
                            <SaveButton variant="contained" onClick={handleSaveTitle} startIcon={<CheckIcon />}>
                                Save
                            </SaveButton>
                            <CancelButton variant="outlined" onClick={handleCloseModal} startIcon={<CloseIcon />}>
                                Cancel
                            </CancelButton>
                        </div>
                    </EditTitleContainer>
                </Modal>
{/* Need to edit here to add text model. */}

                <Modal open={isTextModalOpen} onClose={handleCloseTextModal}>
                    <AddElementContainer>
                        <AddElementTitle variant="h5" component="h2">
                            Add New Text
                        </AddElementTitle>
                        <AddElementInput 
                            required
                            onChange={(e) => setTextAreaHeight(e.target.value)}
                            label="Enter Text Area Height"
                            variant="outlined"
                            margin="normal"
                        />
                        <AddElementInput 
                            required
                            onChange={(e) => setTextAreaWidth(e.target.value)}
                            label="Enter Text Area Width"
                            variant="outlined"
                            margin="normal"
                        />
                        <AddElementInput 
                            required
                            onChange={(e) => setText(e.target.value)}
                            label="Enter New Text Content"
                            variant="outlined"
                            margin="normal"
                        />
                        <AddElementInput 
                            required
                            onChange={(e) => setTextSize(e.target.value)}
                            label="Enter New Text Size"
                            variant="outlined"
                            margin="normal"
                        />
                        <AddElementInput 
                            required
                            onChange={(e) => setTextColor(e.target.value)}
                            label="Enter New Text Color"
                            variant="outlined"
                            margin="normal"
                        />
                        <div>
                            <SaveButton variant="contained" onClick={handleNewText} startIcon={<CheckIcon />}>
                                Save
                            </SaveButton>
                            <CancelButton variant="outlined" onClick={handleCloseTextModal} startIcon={<CloseIcon />}>
                                Cancel
                            </CancelButton>
                        </div>
                        
                    </AddElementContainer>
                </Modal>

                



                <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', position: 'relative' }}>
                    <SlideListContainer>
                        <List sx={{ padding: '0px' }}>
                            {presentation.slides && presentation.slides.map((slide, index) => (
                                <SlideCard
                                    key={slide.id}
                                    className={index === currentSlideIndex ? 'Mui-selected' : ''}
                                    onClick={() => updateSlideIndex(index)}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1">{index + 1}</Typography>
                                    </CardContent>
                                </SlideCard>
                            ))}
                        </List>
                    </SlideListContainer>
                    <SlideContainer>
                        <Box sx={{ display: 'flex', margin: '10px' }}>
                            <IconButton aria-label="delete" onClick={deleteCurrentSlide} sx={{ marginRight: 'auto' }}>
                                <DeleteIcon />
                            </IconButton>
{/* Section 3: Edit here */}

                            {currentSlideIndex !== null && (
                                <Box display="flex" alignItems="center">
                                    <Button
                                        onClick={handleToolExpand}
                                        variant="contained"
                                        startIcon={toolExpand ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                                        sx={{ marginRight: 1 }}
                                        size="small"
                                    >
                                        {toolExpand ? 'Hide' : 'Tool'}
                                    </Button>

                                    {toolExpand && (
                                        <Box display ="flex" gap={0}> 
                                            <IconButton aria-label="textInput" onClick={handleOpenTextModal} sx={{ marginRight: 'auto' }}>
                                                <TextIcon />
                                            </IconButton>

                                            <IconButton aria-label="imageInput" onClick={handleOpenTextModal} sx={{ marginRight: 'auto' }}>
                                                <ImageIcon />
                                            </IconButton>

                                            <IconButton aria-label="videoInput" onClick={handleOpenTextModal} sx={{ marginRight: 'auto' }}>
                                                <VideoIcon />
                                            </IconButton>

                                            <IconButton aria-label="codeInput" onClick={handleOpenTextModal} sx={{ marginRight: 'auto' }}>
                                                <CodeIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            )}
{/* End here */}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', width: '100%' }}>   
                            <IconButton onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                                    <KeyboardArrowLeftIcon />
                            </IconButton>
                            {presentation.slides && currentSlideIndex !== null ? (
                                <Slide 
                                    currentSlideIndex={currentSlideIndex} 
                                    slides={presentation.slides} 
                                    presentation={presentation}
                                    updatePresentationBackend={updatePresentationBackend}
                                    setPresentation={setPresentation} />
                            ) : (
                                <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
                                    Choose a slide to begin editing!
                                </Typography>
                            )}
                            <IconButton
                                onClick={handleNextSlide}
                                disabled={presentation.slides && currentSlideIndex === presentation.slides.length - 1}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </Box>

                        <AddSlideButton aria-label="add" onClick={addNewSlide}>
                            <AddIcon sx={{ color: 'white' }}/>
                        </AddSlideButton>
                    </SlideContainer>
                </Box>

                <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>
                </ErrorPopUp>
            </PresentationContainer>
        </>
    );
}

export default Presentation;