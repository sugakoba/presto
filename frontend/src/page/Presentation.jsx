import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField, IconButton, List, Card, CardContent, Fab, Drawer, ListItemButton, ListItemIcon, ListItemText, Checkbox, RadioGroup, FormControlLabel, Radio } from '@mui/material';
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
  CompareArrows as CompareArrowsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import ErrorPopUp from "../component/ErrorPopUp";
import Slide from "../component/Slide";
import Rearrange from '../component/Rearrange';
import RevisionHistory from '../component/RevisionHistory';

const PresentationContainer = styled(Box)`
    background-color: #fbf1d7;
    min-height: 100vh;
    padding-top: 10px;
`;

const TitleContainer = styled(Box)`
    position: relative;
    display: flex;
    justify-content: center;
    left: 50%;
    align-items: center;
    margin-bottom: 10px;
    transform: translateX(-50%); 
    @media (max-width: 1000px) {
        position: static; 
        transform: none;
    }
`;

const SaveButton = styled(Button)`
    background-color: #C46243;
    box-shadow: none;
    text-transform: none;
    margin-left: 10px;
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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { presentationId, slideNumber } = useParams();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [title, setTitle] = useState(presentation.name);
  const [newTitle, setNewTitle] = useState(title);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [imageInputType, setImageInputType] = useState('url');
    
  const [errorMsg, setErrorMsg] = useState('');
  const [isErrorOpen, setErrorOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isRearrangeOpen, setIsRearrangeOpen] = useState(false);
  const [fade, setFade] = useState(false); 
  const [toolExpand, setToolExpand] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [revisionHistory, setRevisionHistory] = useState([]);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isRevisionHistoryOpen, setIsRevisionHistoryOpen] = useState(false);

  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [textAreaWidth, setTextAreaWidth] = useState(0);
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(0);
  const [textColor, setTextColor] = useState('0');

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageAddress, setImageAddress] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoURL, setVideoURL] = useState("");
  const [videoAuto, setVideoAuto] = useState(false);

  const [codeWidth, setCodeWidth] = useState(0);
  const [codeHeight, setCodeHeight] = useState(0);
  const [code, setCode] = useState("");
  const [codeSize, setCodeSize] = useState(0);

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

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  }

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  }

  const handleOpenVideoModal = () => {
    setIsVideoModalOpen(true);
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  }

  const handleOpenCodeModal = () => {
    setIsCodeModalOpen(true);
  }

  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
  }

  const handleCloseError = () => {
    setErrorOpen(false);
  }    

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageAddress(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSlideIndex = (index) => {
    setCurrentSlideIndex(index);
    navigate(`/dashboard/${presentationId}/${index + 1}`);
  };

  const handleSlideChange = (newIndex) => {
    setFade(true); 
    setTimeout(() => {
      setCurrentSlideIndex(newIndex); 
      setFade(false); 
      navigate(`/dashboard/${presentationId}/${newIndex + 1}`, { replace: true });
    }, 500); 
  };

  const updatePresentationBackend = async (updatedPresentation) => {
    saveVersion();
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

  const toggleRearrangeScreen = () => {
    setIsRearrangeOpen(!isRearrangeOpen);
  };

  const handleRearrange = (newSlides) => {
    const updatedPresentation = { ...presentation, slides: newSlides };
    setPresentation(updatedPresentation);
    updatePresentationBackend(updatedPresentation);
  };

  /*********************************
    **********************************
    **** Change Slide layout here ****
    **********************************
    **********************************/

    
  const handleNewText = async () => {
    let elementLength = presentation.slides[currentSlideIndex].elements.length;

    if (elementLength === 0) {
      elementLength = 1;
    } else {
      elementLength = presentation.slides[currentSlideIndex].elements[elementLength - 1].id + 1
    }

    const newText = {
      id: elementLength,
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

  const handleNewImage = async () => {
    let elementLength = presentation.slides[currentSlideIndex].elements.length;

    if (elementLength === 0) {
      elementLength = 1;
    } else {
      elementLength = presentation.slides[currentSlideIndex].elements[elementLength - 1].id + 1
    }

    const newImage = {
      id: elementLength,
      type: "image",
      height: imageHeight,
      width: imageWidth,
      url: imageAddress,
      description: imageDescription,
      xpos: 0,
      ypos: 0
    }

    const updatedElements = [...presentation.slides[currentSlideIndex].elements, newImage];
    const updatedSlides = presentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: updatedElements }
        : slide
    );

    const updatedPresentation = { ...presentation, slides: updatedSlides };

    setPresentation(updatedPresentation);
    updatePresentationBackend(updatedPresentation);
    handleCloseImageModal();

  }

  const handleNewVideo = async() => {
    let elementLength = presentation.slides[currentSlideIndex].elements.length;

    if (elementLength === 0) {
      elementLength = 1;
    } else {
      elementLength = presentation.slides[currentSlideIndex].elements[elementLength - 1].id + 1
    }

    const newVideo = {
      id: elementLength,
      type: "video",
      height: videoHeight,
      width: videoWidth,
      url: videoURL,
      autoplay: videoAuto,
      xpos: 0,
      ypos: 0
    }

    const updatedElements = [...presentation.slides[currentSlideIndex].elements, newVideo];
    const updatedSlides = presentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: updatedElements }
        : slide
    );

    const updatedPresentation = { ...presentation, slides: updatedSlides };

    setPresentation(updatedPresentation);
    updatePresentationBackend(updatedPresentation);
    handleCloseVideoModal();
  }

  const handleNewCode = async() => {
    let elementLength = presentation.slides[currentSlideIndex].elements.length;

    if (elementLength === 0) {
      elementLength = 1;
    } else {
      elementLength = presentation.slides[currentSlideIndex].elements[elementLength - 1].id + 1
    }

    const newCode = {
      id: elementLength,
      type: "code",
      height: codeHeight,
      width: codeWidth,
      size: codeSize,
      code: code,
      xpos: 0,
      ypos: 0
    }

    const updatedElements = [...presentation.slides[currentSlideIndex].elements, newCode];
    const updatedSlides = presentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: updatedElements }
        : slide
    );

    const updatedPresentation = { ...presentation, slides: updatedSlides };

    setPresentation(updatedPresentation);
    updatePresentationBackend(updatedPresentation);
    handleCloseCodeModal();
  }

  const addNewSlide = async () => {
    let newId = presentation.slides[presentation.slides.length - 1].id + 1;
    const idExists = (id) => presentation.slides.some(slide => slide.id === id);
    while (idExists(newId)) {
      newId += 1; 
    }

    const newSlide = {
      id: newId,
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
    const newIndex = (currentSlideIndex + 1) % presentation.slides.length;
    handleSlideChange(newIndex);
  };

  const handlePrevSlide = () => {
    const newIndex = (currentSlideIndex - 1 + presentation.slides.length) % presentation.slides.length;
    handleSlideChange(newIndex);
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

  const toggleRevisionHistory = () => {
    setIsRevisionHistoryOpen(!isRevisionHistoryOpen);
  };

  const saveVersion = () => {
    const now = new Date();
    if (!lastSaveTime || (now - lastSaveTime >= 60000)) { 
      const newVersion = {
        timestamp: now,
        slides: [...presentation.slides]
      };
      setRevisionHistory(prevHistory => [...prevHistory, newVersion]);
      setLastSaveTime(now);
    }
  };    

  const handleRestore = (slides) => {
    setPresentation(prevPresentation => ({
      ...prevPresentation,
      slides: slides
    }));
    setIsRevisionHistoryOpen(false); 
  };

  const openPreview = () => {
    const slidePreviewNum = (slideNumber || 1);
    window.open(`/dashboard/${presentationId}/preview/${slidePreviewNum}`, "_blank");
  };    

  const toggleDrawer = (open) => () => {
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
            '@media (max-width: 1000px)': {
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
            <ListItemButton variant="outlined" onClick={toggleRearrangeScreen} fullWidth>
              <ListItemIcon>
                <CompareArrowsIcon />
              </ListItemIcon>
              <ListItemText primary="Rearrange Slides" />
            </ListItemButton>
            <ListItemButton variant="outlined" onClick={toggleRevisionHistory} fullWidth>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Version History" />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box 
            sx={{
              display: 'flex', 
              '@media (max-width: 1000px)': {
                display: 'none',
              },
              ml: 12,
              mt: 0
            }}
          >
            <SaveButton variant="contained" onClick={handleBack} startIcon={<ArrowBackIcon />}>
                            Back
            </SaveButton>
            <CancelButton variant="outlined" onClick={handleDeleteClick} startIcon={<DeleteIcon />}>
                            Delete
            </CancelButton>
          </Box>
          <Box 
            sx={{
              display: 'flex', 
              '@media (max-width: 1000px)': {
                display: 'none',
              },
              mt: 0,
              mr: 2
            }}
          >
            <CancelButton aria-label="change-thumbnail" variant="outlined" component="label" startIcon={<ImageIcon />}>
                            Change Thumbnail
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
            </CancelButton>
            <SaveButton aria-label="rearrange-slides" variant="contained" onClick={toggleRearrangeScreen} startIcon={<CompareArrowsIcon />}>
                            Rearrange Slides
            </SaveButton>
            <SaveButton aria-label="rearrange-slides" variant="contained" onClick={toggleRevisionHistory} startIcon={<HistoryIcon />}>
                            Version History
            </SaveButton>
            <SaveButton aria-label="presentation-preview" variant="contained" onClick={openPreview} startIcon={<SlideshowIcon />}>
                            Preview
            </SaveButton>
          </Box>
        </Box>
        <TitleContainer>
          <Typography variant="h4" sx={{ margin: '5px' }}>
            {title}
          </Typography>
          <IconButton onClick={handleOpenModal} aria-label="edit title">
            <EditOutlinedIcon />
          </IconButton>
        </TitleContainer>
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
              label="Enter New Text Size In em"
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


        <Modal open={isImageModalOpen} onClose={handleCloseImageModal}>
          <AddElementContainer>
            <AddElementTitle variant="h5" component="h2">
                            Add New Image
            </AddElementTitle>
            <AddElementInput
              required
              onChange={(e) => setImageHeight(e.target.value)}
              label="Enter Image Height"
              variant="outlined"
              margin="normal"
            />
            <AddElementInput
              required
              onChange={(e) => setImageWidth(e.target.value)}
              label="Enter Image Width"
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
                  onChange={(e) => setImageAddress(e.target.value)}
                  label="Enter Image URL"
                  variant="outlined"
                  margin="normal"
                />
              ) : (
                <Button variant="outlined" component="label" sx={{ marginTop: 2 }} >
                                    Upload Image File
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
              )}
            </div>


            <AddElementInput
              required
              onChange={(e) => setImageDescription(e.target.value)}
              label="Enter Alt Description"
              variant="outlined"
              margin="normal"
            />
            <div>
              <SaveButton variant="contained" onClick={handleNewImage} startIcon={<CheckIcon />}>
                                Save
              </SaveButton>
              <CancelButton variant="outlined" onClick={handleCloseImageModal} startIcon={<CloseIcon />}>
                                Cancel
              </CancelButton>
            </div>
                        
          </AddElementContainer>
        </Modal>

        <Modal open={isVideoModalOpen} onClose={handleCloseVideoModal}>
          <AddElementContainer>
            <AddElementTitle variant="h5" component="h2">
                            Add New Video
            </AddElementTitle>
            <AddElementInput
              required
              onChange={(e) => setVideoHeight(e.target.value)}
              label="Enter Video Height"
              variant="outlined"
              margin="normal"
            />
            <AddElementInput
              required
              onChange={(e) => setVideoWidth(e.target.value)}
              label="Enter Video Width"
              variant="outlined"
              margin="normal"
            />
            <AddElementInput
              required
              onChange={(e) => setVideoURL(e.target.value)}
              label="Enter Video URL"
              variant="outlined"
              margin="normal"
            />
            <div sx={{ display: 'flex', alignItems: 'center' }}>
                            Autoplay?
              <Checkbox
                checked={videoAuto}
                onChange={(e) => setVideoAuto(e.target.checked)}
                color="primary"
              />
            </div>
            <div>
              <SaveButton variant="contained" onClick={handleNewVideo} startIcon={<CheckIcon />}>
                                Save
              </SaveButton>
              <CancelButton variant="outlined" onClick={handleCloseVideoModal} startIcon={<CloseIcon />}>
                                Cancel
              </CancelButton>
            </div>
                        
          </AddElementContainer>
        </Modal>


        <Modal open={isCodeModalOpen} onClose={handleCloseCodeModal}>
          <AddElementContainer>
            <AddElementTitle variant="h5" component="h2">
                            Add New Code Block
            </AddElementTitle>
            <AddElementInput
              required
              onChange={(e) => setCodeHeight(e.target.value)}
              label="Enter Code Block Height"
              variant="outlined"
              margin="normal"
            />
            <AddElementInput
              required
              onChange={(e) => setCodeWidth(e.target.value)}
              label="Enter Code Block Width"
              variant="outlined"
              margin="normal"
            />

            <AddElementInput 
              required
              onChange={(e) => setCodeSize(e.target.value)}
              label="Enter New Code Size in em"
              variant="outlined"
              margin="normal"
            />

            <AddElementInput
              required
              onChange={(e) => setCode(e.target.value)}
              label="Enter New Code Block"
              variant="outlined"
              margin="normal"
              multiline
              minRows={4}
              fullWidth
              sx={{
                overflow: "auto",
              }}

            />

            <div>
              <SaveButton variant="contained" onClick={handleNewCode} startIcon={<CheckIcon />}>
                                Save
              </SaveButton>
              <CancelButton variant="outlined" onClick={handleCloseCodeModal} startIcon={<CloseIcon />}>
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
            {presentation.slides ? (
              <Box sx={{ display: 'flex', margin: '10px' }}>
                <IconButton aria-label="delete" onClick={deleteCurrentSlide} sx={{ marginRight: 'auto' }}>
                  <DeleteIcon />
                </IconButton>
                {/* Section 3: Edit here */}
                <Box display="flex" alignItems="center">
                  <SaveButton
                    onClick={handleToolExpand}
                    variant="contained"
                    startIcon={toolExpand ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                    sx={{ marginRight: 1 }}
                    size="small"
                  >
                    {toolExpand ? 'Hide' : 'Tool'}
                  </SaveButton>

                  {toolExpand && (
                    <Box display ="flex" gap={0}> 
                      <IconButton aria-label="textInput" onClick={handleOpenTextModal} sx={{ marginRight: 'auto' }}>
                        <TextIcon />
                      </IconButton>

                      <IconButton aria-label="imageInput" onClick={handleOpenImageModal} sx={{ marginRight: 'auto' }}>
                        <ImageIcon />
                      </IconButton>

                      <IconButton aria-label="videoInput" onClick={handleOpenVideoModal} sx={{ marginRight: 'auto' }}>
                        <VideoIcon />
                      </IconButton>

                      <IconButton aria-label="codeInput" onClick={handleOpenCodeModal} sx={{ marginRight: 'auto' }}>
                        <CodeIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {/* End here */}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                Loading slides...
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', width: '100%' }}>   
              {presentation.slides && presentation.slides.length >= 2 && (
                <IconButton onClick={handlePrevSlide} disabled={currentSlideIndex === 0}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
              )}
              {presentation.slides && (
                <Slide 
                  fade={fade}
                  currentSlideIndex={currentSlideIndex} 
                  slides={presentation.slides} 
                  presentation={presentation}
                  updatePresentationBackend={updatePresentationBackend}
                  setPresentation={setPresentation} />
              )}
              {presentation.slides && presentation.slides.length >= 2 && (
                <IconButton
                  onClick={handleNextSlide}
                  disabled={presentation.slides && currentSlideIndex === presentation.slides.length - 1}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              )}
            </Box>

            <AddSlideButton aria-label="add" onClick={addNewSlide}>
              <AddIcon sx={{ color: 'white' }}/>
            </AddSlideButton>
          </SlideContainer>
        </Box>
        <Rearrange 
          open={isRearrangeOpen} 
          onClose={toggleRearrangeScreen} 
          slides={presentation.slides} 
          onRearrange={handleRearrange}
        />
        <RevisionHistory 
          open={isRevisionHistoryOpen} 
          onClose={toggleRevisionHistory} 
          history={revisionHistory}
          onRestore={handleRestore}
        />

        <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>
        </ErrorPopUp>
      </PresentationContainer>
    </>
  );
}

export default Presentation;