import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Dashboard( { token } ) {
    const [presentations, setPresentations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPresentationName, setNewPresentationName] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPresentationName('');
    };

    const handleCreatePresentation = () => {
        if (newPresentationName.trim() !== '') {
            const newPresentation = {
                id: presentations.length + 1,
                name: newPresentationName,
                slides: ['Empty Slide']
            };
            setPresentations([...presentations, newPresentation]);
            handleCloseModal();
        }
    };

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
        width: 250px;
        padding-top: 20px;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
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

    const CreateModalContainer = styled(Box)`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400;
        background-color: #fff;
        box-shadow: 24;
        p: 4,
    `;

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
                    <div className="presentations-list">
                        {presentations.map((presentation) => (
                        <div key={presentation.id} className="presentation-item">
                            <h3>{presentation.name}</h3>
                            <p>Slides: {presentation.slides.length}</p>
                        </div>
                        ))}
                    </div>
                </ContentArea>

                {isModalOpen && (
                    <Modal open={isModalOpen} onClose={handleCloseModal}>
                        <CreateModalContainer>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                New Presentation
                            </Typography>
                            <input
                                type="text"
                                value={newPresentationName}
                                onChange={(e) => setNewPresentationName(e.target.value)}
                                placeholder="Enter name"
                            />
                            <div>
                                <button onClick={handleCreatePresentation}>
                                    Create
                                </button>
                                <button onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </CreateModalContainer>
                    </Modal>
                )}
            </DashboardContainer>
        </>
    )
}

export default Dashboard;