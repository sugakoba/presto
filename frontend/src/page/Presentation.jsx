import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function Presentation({ token }) {
    const [presentation, setPresentation] = useState({});
    const [presentations, setPresentations] = useState([]);
    const { presentationId } = useParams();
    const navigate = useNavigate();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

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

    return (
        <div>
            <h1>{presentation.name}</h1>
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
        </div>
    );
}

export default Presentation;