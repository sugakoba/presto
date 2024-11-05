import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ErrorPopUp from "../component/ErrorPopUp";

const TitleContainer = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
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

const EditModalContainer = styled(Box)`
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

function Presentation({ token }) {
    const [presentation, setPresentation] = useState({});
    const [presentations, setPresentations] = useState([]);
    const { presentationId } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [title, setTitle] = useState(presentation.name);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
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
            setErrorMsg('Failed to delete presentation:', error.response.data.error);
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
            setErrorMsg('Failed to delete presentation:', error.response.data.error);
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
            <TitleContainer>
                <Typography variant="h5" style={{ marginRight: '10px' }}>
                    {title}
                </Typography>
                <EditOutlinedIcon onClick={handleOpenModal} aria-label="edit title">
                </EditOutlinedIcon>
            </TitleContainer>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <EditModalContainer>
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
                </EditModalContainer>
            </Modal>
            <Button variant="outlined" onClick={handleBack}>
                Back
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
                Delete Presentation
            </Button>
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

            <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>
            </ErrorPopUp>
        </>
    );
}

export default Presentation;