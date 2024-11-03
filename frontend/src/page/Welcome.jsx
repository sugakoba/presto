import { Box, Button, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";


const BackgroundContainer = styled(Box) `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const WelcomeContainer = styled(Box)`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    width: 400px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
`;

function Welcome({ token }) {


    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/register');
    }

    const goToLogin = () => {
        navigate('/login');
    }

    return (
        <>
        <BackgroundContainer>
            <WelcomeContainer>
                <h2>Welcome To Presto </h2>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={goToLogin}
                    style={{ width: '80%' }}
                >
                    Login
                </Button>

                <Button 
                    variant="contained"
                    color="primary"
                    onClick={goToRegister}
                    style={{ width: '80%' }}
                >
                    register
                </Button>

            </WelcomeContainer>
        </BackgroundContainer>

        </>
    )
}

export default Welcome;