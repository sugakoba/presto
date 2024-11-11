import React, { useState } from 'react';
import { Box, Modal, Button, Typography, Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ChromePicker } from 'react-color';

const PickerContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
`

const ModalContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 24;
    border-radius: 10px;
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

const BackgroundPicker = ({ isOpen, onClose, onBackgroundChange }) => {
    const [backgroundStyle, setBackgroundStyle] = useState('solid');
    const [solidColor, setSolidColor] = useState('#ffffff');
    const [gradientColor1, setGradientColor1] = useState('#ffffff');
    const [gradientColor2, setGradientColor2] = useState('#000000');
    const [imageFile, setImageFile] = useState(null);
    const [isDefault, setIsDefault] = useState(false);

    const handleBackgroundStyleChange = (event) => {
        setBackgroundStyle(event.target.value);
    };

    const handleSolidColorChange = (color) => {
        setSolidColor(color.hex);
    };

    const handleGradientColorChange1 = (color) => {
        setGradientColor1(color.hex);
    };

    const handleGradientColorChange2 = (color) => {
        setGradientColor2(color.hex);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const base64String = reader.result; 
                setImageFile(base64String); 
            };
            
            reader.readAsDataURL(file); 
        }
    };

    const handleDefault = () => {
        handleApply();
        setIsDefault();
    }

    const handleApply = () => {
        if (backgroundStyle === 'solid') {
            onBackgroundChange(solidColor, isDefault);
        } else if (backgroundStyle === 'gradient') {
            onBackgroundChange(`linear-gradient(45deg, ${gradientColor1}, ${gradientColor2})`, isDefault);
        } else if (backgroundStyle === 'image' && imageFile) {
            onBackgroundChange(`url(${imageFile})`, isDefault);
        }
        onClose();
    };    

    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalContainer>
                <Typography variant="h6" gutterBottom>
                    Choose Background Style
                </Typography>
                <RadioGroup value={backgroundStyle} onChange={handleBackgroundStyleChange}>
                    <FormControlLabel value="solid" control={<Radio />} label="Solid Color" />
                    <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                </RadioGroup>

                {backgroundStyle === 'solid' && (
                    <Box sx={{ mt: 2 }} >
                        <Typography variant="subtitle1" align='center' sx={{ mb: 2 }}>Choose Color</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ChromePicker color={solidColor} onChangeComplete={handleSolidColorChange}/>
                        </Box>
                    </Box>
                )}

                {backgroundStyle === 'gradient' && (
                    <Box sx={{ mt: 2 }} >
                        <Typography variant="subtitle1" align='center' sx={{ mb: 2 }}>Choose Gradient Colors</Typography>
                        <PickerContainer>
                            <ChromePicker color={gradientColor1} onChangeComplete={handleGradientColorChange1} />
                            <ChromePicker color={gradientColor2} onChangeComplete={handleGradientColorChange2} />
                        </PickerContainer>
                    </Box>
                )}

                {backgroundStyle === 'image' && (
                    <Box sx={{ mt: 2 }}>
                        <SaveButton variant="contained" component="label">
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </SaveButton>
                        {imageFile && <Typography variant="caption" mt={1}>Image uploaded</Typography>}
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isDefault}
                                onChange={() => setIsDefault(!isDefault)}
                                sx={{ 
                                    color: '#C46243',  
                                    '&.Mui-checked': {
                                        color: '#C46243',
                                    }
                                }}
                            />
                        }
                        label="Set as Default Style"
                    />
                    <SaveButton onClick={handleApply} variant="contained" startIcon={<CheckIcon />}>
                        Apply
                    </SaveButton>
                    <CancelButton onClick={onClose} variant="outlined" startIcon={<CloseIcon />}>
                        Cancel
                    </CancelButton>
                </Box>
            </ModalContainer>
        </Modal>
    );
};

export default BackgroundPicker;
