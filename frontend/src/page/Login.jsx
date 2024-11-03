import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography } from "@mui/material";
import ErrorPopUp from "../component/ErrorPopUp";

const BackgroundContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
`;

const LoginContainer = styled(Box)`
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
    position: relative;
`;

const BackButton = styled(Button) `
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    position: absolute;
    top: 10px;
    left: 10px;
`;


function Login({ token, handleSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);
    const[errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const login = () => {
        axios.post('http://localhost:5005/admin/auth/login', {
            email: email,
            password: password,
        })
        .then(function (response) {
            handleSuccess(response.data.token);
        }) 
        .catch(function (error) {
            setErrorMsg(error.response.data.error);
            setErrorOpen(true);
        });
    }

    const enterKey = (event) => {
        if (event.key === 'Enter') {
            login();
        }
    }

    const handleCloseError = () => {
        setErrorOpen(false);
    }

    useEffect(() => {
        window.addEventListener('keydown', enterKey);

        return () => {
            window.removeEventListener('keydown', enterKey);
        }
    }, []);


    return (
        <>
            <BackgroundContainer>
                <LoginContainer>

                    <Typography variant="h4" component="h1" align="center">
                        Login
                    </Typography>

                    <TextField 
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '80%' }}
                    />

                    <TextField 
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                        style={{ width: '80%' }}
                    />

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={login}
                        style={{ width: '80%' }}
                    >
                        Login
                    </Button>

                    <BackButton onClick={() => navigate('/welcome')}>Back</BackButton>
                </LoginContainer>

            </BackgroundContainer>

            <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>

            </ErrorPopUp>

        </>
    )
}

export default Login;