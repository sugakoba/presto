import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField, IconButton, List, ListItem, ListItemText, Divider, Card, CardContent, Fab } from '@mui/material';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import ErrorPopUp from "../component/ErrorPopUp";

const PresentationContainer = styled(Box)`
    background-color: #fbf1d7;
    min-height: 100vh;
    padding-top: 10px;
`;

const TitleContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
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

function Presentation({ token }) {
    const [presentation, setPresentation] = useState({});
    const [presentations, setPresentations] = useState([]);
    const { presentationId } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState(presentation.name);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

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

    const handleCloseError = () => {
        setErrorOpen(false);
    }    

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const addNewSlide = async () => {
        const newSlide = {
            id: presentation.slides.length + 1,
            title: null,
            content: null,
            elements: []
        };
        const updatedSlides = [...presentation.slides, newSlide];
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        setPresentation(updatedPresentation);
        setCurrentSlideIndex(updatedSlides.length - 1);
        
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
            setErrorMsg('Failed to save new slide: ', error.response.data.error);
            setErrorOpen(true);
        }
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < presentation.slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
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

    useEffect(() => {
        fetchPresentationInfo();
    }, []);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    return (
        <>
            <PresentationContainer>
                <ButtonContainer>
                    <SaveButton variant="contained" onClick={handleBack} startIcon={<ArrowBackIcon />}>
                        Back
                    </SaveButton>
                    <CancelButton variant="outlined" onClick={handleDeleteClick} startIcon={<DeleteIcon />}>
                        Delete
                    </CancelButton>
                </ButtonContainer>
                <Modal
                    open={showDeleteConfirmation}
                    onClose={cancelDelete}
                    aria-labelledby="delete-confirmation-title"
                >
                    <div style={{ padding: 20, background: '#fff', margin: 'auto', width: 300 }}>
                        <Typography id="delete-confirmation-title" variant="h6">
                            Are you sure?
                        </Typography>
                        <Button onClick={deletePresentation} color="error">
                            Yes
                        </Button>
                        <Button onClick={cancelDelete}>No</Button>
                    </div>
                </Modal>
                <ButtonContainer>
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
                <TitleContainer>
                    <Typography variant="h4" style={{ marginRight: '5px' }}>
                        {title}
                    </Typography>
                    <IconButton onClick={handleOpenModal} aria-label="edit title">
                        <EditOutlinedIcon />
                    </IconButton>
                </TitleContainer>
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
                <Box display="flex" height="calc(100vh - 170px)">
                    <SlideListContainer>
                        <List style={{ padding: '0px' }}>
                            {presentation.slides && presentation.slides.map((slide, index) => (
                                <SlideCard
                                    key={slide.id}
                                    className={index === currentSlideIndex ? 'Mui-selected' : ''}
                                    onClick={() => setCurrentSlideIndex(index)}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1">{slide.id}</Typography>
                                    </CardContent>
                                </SlideCard>
                            ))}
                        </List>
                    </SlideListContainer>
                    <SlideContainer>
                        <ButtonContainer>
                            <IconButton onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleNextSlide}
                                disabled={presentation.slides && currentSlideIndex === presentation.slides.length - 1}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </ButtonContainer>
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