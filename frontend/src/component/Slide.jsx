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
      const updatedSlides = slides.map((slide) =>
      // only change slides with the default style, as slides with customs styles always overrides default
        slide.backgroundStyle === presentation.defaultStyle
          ? { ...slide, backgroundStyle: style }
          : slide
      );
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

