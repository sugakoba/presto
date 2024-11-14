import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';

const FullScreenContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #333;
    overflow: hidden;
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
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
`;

const TextElement = styled(Box)`
    position: absolute;
    text-align: left;
    line-height: 1;
    padding: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
`;

const Preview = ({ token }) => {
    const [fade, setFade] = useState(false); 
    const [slides, setSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const { presentationId, slideNumber } = useParams();
    const currentSlide = slides[currentSlideIndex];
    const navigate = useNavigate();

    const fetchSlides = async () => {
        try {
            const response = await axios.get('http://localhost:5005/store', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const presentationsData = response.data.store.presentations;
                presentationsData.map(presentation => {
                    if (Number(presentation.id) === Number(presentationId)) {
                        setSlides(presentation.slides);
                    }
                })
            }
        } catch (error) {
            setErrorMsg(error.response.data.error);
            setErrorOpen(true);
        }
    };

    const handleSlideChange = (newIndex) => {
        setFade(true); 
        setTimeout(() => {
            setCurrentSlideIndex(newIndex); 
            setFade(false); 
            navigate(`/dashboard/${presentationId}/preview/${index + 1}`, { replace: true });
        }, 500); 
    };

    const handleNextSlide = () => {
        const newIndex = currentSlideIndex < slides.length - 1 ? currentSlideIndex + 1 : 0;
        handleSlideChange(newIndex);
        
    };
    
    const handlePrevSlide = () => {
        const newIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : slides.length - 1;
        handleSlideChange(newIndex);
    };    

    useEffect(() => {
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slideNumber !== null && slides && slides[Number(slideNumber) - 1]) {
            setCurrentSlideIndex(Number(slideNumber) - 1);
        }
    }, [slides, slideNumber]);

    return (
        <>
            {currentSlide && (
                <FullScreenContainer 
                    fade={fade}
                    sx={{
                        background: currentSlide.backgroundStyle.includes('url(') ? `center / cover no-repeat ${currentSlide.backgroundStyle}` : currentSlide.backgroundStyle
                    }}
                >
                    {/* to modify after 2.3 has been setup */}
                    {/* <Typography variant="h4" color="white">{currentSlide.elements}</Typography> */}
                    {currentSlide.elements.map((element) => {
                        const commonStyles = {
                            top: `${element.ypos}%`,
                            left: `${element.xpos}%`,
                            height: `${element.height}%`,
                            width: `${element.width}%`,
                            zIndex: element.id,
                        };

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
                                    src={`${element.url}?autoplay=${element.auto ? 1 : 0}`}
                                    allow='autoplay'
                                />
                            </TextElement>
                        ) : null;
                    })}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <IconButton onClick={handlePrevSlide} disabled={currentSlideIndex === 0} sx={{ bgcolor: '#FFFFFF80', ml: 2 }}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <IconButton onClick={handleNextSlide} disabled={currentSlideIndex === slides.length - 1} sx={{ bgcolor: '#FFFFFF80', mr: 2 }}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Box>

                    <SlideNumber>
                        <Typography>{currentSlideIndex + 1}</Typography>
                    </SlideNumber>
                </FullScreenContainer>
            )}
        </>
    );
};

export default Preview;
