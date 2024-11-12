import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const Preview = ({ token }) => {
    const [slides, setSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const { presentationId } = useParams();

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

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleNextSlide = () => {
        setCurrentSlideIndex((prevIndex) =>
            prevIndex < slides.length - 1 ? prevIndex + 1 : 0
        );
    };

    const handlePrevSlide = () => {
        setCurrentSlideIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : slides.length - 1
        );
    };

    const currentSlide = slides[currentSlideIndex];

    return (
        <>
            {currentSlide && (
                <FullScreenContainer sx={{
                    background: currentSlide.backgroundStyle.includes('url(') ? `center / cover no-repeat ${currentSlide.backgroundStyle}` : currentSlide.backgroundStyle
                }}>
                    {/* to modify after 2.3 has been setup */}
                    <Typography variant="h4" color="white">{currentSlide.elements}</Typography>

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
