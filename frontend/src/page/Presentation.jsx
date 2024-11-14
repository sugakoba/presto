import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField, IconButton, List, Card, CardContent, Fab, Drawer, ListItemButton, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, Checkbox, RadioGroup, FormControlLabel, Radio } from '@mui/material';
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
  ExpandMore as ExpandMoreIcon,
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

