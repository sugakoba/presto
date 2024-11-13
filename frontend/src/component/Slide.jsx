import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorizeIcon from '@mui/icons-material/Colorize';
import BackgroundPicker from './BackgroundPicker';

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

const Slide = ({ fade, currentSlideIndex, slides, presentation, updatePresentationBackend, setPresentation }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const currentSlide = slides[currentSlideIndex];
    const [backgroundStyle, setBackgroundStyle] = useState(currentSlide?.backgroundStyle || 'white');

    const handleOpenPicker = () => {
        setIsPickerOpen(true);
    };

    const handleClosePicker = () => {
        setIsPickerOpen(false);
    };

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

    const handleElementEdit = (element) => {

    }


    const handleElementDelete = (element) => {

    }

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
                        // onDoubleClick={() => handleElementDoubleClick(element)}
                        style={{
                            top: element.ypos,
                            left: element.xpos,
                            height: `${element.height}%`,
                            width: `${element.width}%`,
                            fontSize: `${element.size}em`,
                            color: element.color,
                        }}
                    >
                        {element.text}
                    </TextElement>
                ))}

                <IconButton 
                    onClick={handleOpenPicker}
                    sx={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', 
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
        </>
    );
};

export default Slide;
