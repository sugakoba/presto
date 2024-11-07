import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SlideBox = styled(Box)`
    position: relative;
    width: 75%;
    aspect-ratio: 16 / 9;
    background-color: white;
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

const Slide = ({ currentSlideIndex }) => {
    return (
        <SlideBox>
            <SlideNumber>
                <Typography>{currentSlideIndex + 1}</Typography>
            </SlideNumber>
        {/* Content of the slide can be added here */}
        </SlideBox>
    );
};

export default Slide;
