import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField, Card, CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ErrorPopUp from "../component/ErrorPopUp";
import axios from 'axios';
import Grid from '@mui/material/Grid2';

const DashboardContainer = styled(Box)`
    background-color: #fbf1d7;
    height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    top: 0;
    left: 0;
    padding: 20px;
`;

const Sidebar = styled(Box)`
    max-width: 250px;
    padding-top: 40px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const ContentArea = styled(Box)`
    flex: 1;
    background-color: white;
    padding: 20px;
    overflow: auto;
    border-radius: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const CreateButton = styled(Button)`
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

const CreateModalContainer = styled(Box)`
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

const CreateTitle = styled(Typography)`
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding-bottom: 20px;
`;

const CreateName = styled(TextField)({
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

const PresentationCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fbf1d7;
    width: 100%;
    aspect-ratio: 2 / 1;
    min-width: 100px;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const Thumbnail = styled(Box)`
    aspect-ratio: 1 / 1;
    height: 50%;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 10px;
`;

function Dashboard({ token }) {
    const [presentations, setPresentations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPresentationName, setNewPresentationName] = useState('');
    const inputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);

    const navigate = useNavigate();
    const handlePresentationClick = (presentationId) => {
        navigate(`/dashboard/${presentationId}`);
    };

    const fetchPresentations = async () => {
        try {
            const response = await axios.get('http://localhost:5005/store', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const presentationsData = response.data.store.presentations;
                const presentationsArray = Array.isArray(presentationsData) ? presentationsData : [];
                setPresentations(presentationsArray);
            }
        } catch (error) {
            setErrorMsg(error.response.data.error);
            setErrorOpen(true);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPresentationName('');
    };

    const handleCloseError = () => {
        setErrorOpen(false);
    }

    const isEmptyPresentation = (presentation) =>
        !presentation || Object.keys(presentation).length === 0;    

    const shouldShowEmptyMessage = presentations.length === 0 || 
        (presentations.length === 1 && isEmptyPresentation(presentations[0]));

    const handleCreatePresentation = async () => {
        let newId = 1;
        if (presentations.length > 0) {
            newId = presentations[presentations.length - 1].id + 1;
        }
        if (newPresentationName.trim() !== '') {
            /*********************************
             * Automatically creates 1 slide *
            **** Change Slide layout here ****
            **********************************/
            const newPresentation = {
                id: newId,
                description: "",
                name: newPresentationName,
                slides: [{
                    "id": 1,
                    "elements": []
                }],
                thumbnail: null
            };

            try {
                await fetchPresentations();
                let updatedPresentations = [newPresentation];
                if (presentations.length > 0) {
                    updatedPresentations = [...presentations, newPresentation];
                } 
                const response = await axios.put('http://localhost:5005/store', 
                    { store: { presentations: updatedPresentations } },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    }
                );
                if (response.status === 200) {
                    setPresentations(updatedPresentations);
                    handleCloseModal();
                } else {
                    setErrorMsg('Failed to store presentation');
                    setErrorOpen(true);
                }
            } catch (error) {
                setErrorMsg(error.response.data.error);
                setErrorOpen(true);
            } 
        }
    };

    useEffect(() => {
        fetchPresentations();
    }, []);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    return (
        <>
            <DashboardContainer>
                <Sidebar>
                    <CreateButton variant="contained" onClick={handleOpenModal} startIcon={<AddIcon />}>
                        New Presentation
                    </CreateButton>
                </Sidebar>
                <ContentArea>
                    <Typography variant="h4" gutterBottom>
                        Presentations
                    </Typography>

                    {shouldShowEmptyMessage ? (
                        <Typography variant="body1" color="textSecondary">
                            No presentations available. Create a new one!
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {presentations.map((presentation) => (
                                <Grid size={{ xs: 12, sm: 8, md: 4 }} key={presentation.id}>
                                    <PresentationCard onClick={() => handlePresentationClick(presentation.id)}>
                                        {presentation.thumbnail ? (
                                            <CardMedia
                                            component="img"
                                            sx={{ maxHeight: 100, width: 'auto', height: '50%', margin: '7px' }}
                                            image={presentation.thumbnail}
                                            alt={presentation.name}
                                            />
                                        ) : (
                                            <Thumbnail /> 
                                        )}
                                        <Typography variant="h6">{presentation.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {presentation.description}
                                        </Typography>
                                        <Typography variant="caption">
                                            Slides: {presentation.slides.length}
                                        </Typography>
                                    </PresentationCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </ContentArea>

                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <CreateModalContainer>
                        <CreateTitle variant="h5" component="h2">
                            New Presentation
                        </CreateTitle>
                        <CreateName
                            required
                            inputRef={inputRef} 
                            value={newPresentationName}
                            onChange={(e) => setNewPresentationName(e.target.value)}
                            label="Enter name"
                            variant="outlined"
                            margin="normal"
                        />
                        <div>
                            <CreateButton variant="contained" onClick={handleCreatePresentation} startIcon={<AddIcon />}>
                                Create
                            </CreateButton>
                            <CancelButton variant="outlined" onClick={handleCloseModal} startIcon={<CloseIcon />}>
                                Cancel
                            </CancelButton>
                        </div>
                    </CreateModalContainer>
                </Modal>
            </DashboardContainer>

            <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>
            </ErrorPopUp>
        </>
    );
}

export default Dashboard;
