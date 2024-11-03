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

const RegisterContainer = styled(Box)`
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

function Register({ token, handleSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);
    const[errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const register = () => {
        if (!email || !password) {
            setErrorMsg("Email and password can't be empty.");
            setErrorOpen(true);
            return;
        }

        if (password === confirmPassword) {
            axios.post('http://localhost:5005/admin/auth/register', {
                email: email,
                password: password,
                name: name,
            }).then(function (response) {
                handleSuccess(response.data.token);
            }).catch(function (error) {
                setErrorMsg(error.response.data.error);
                setErrorOpen(true);
            })
        } else {
            setErrorMsg('Password does not match confirm Password')
            setErrorOpen(true);
        }
    }

    const enterKey = (event) => {
        if (event.key === 'Enter') {
            register();
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
    }, [email, password, confirmPassword, name]);

    return (
        <>
            <BackgroundContainer>
                <RegisterContainer>
                    <Typography variant="h4" component="h1" align="center">
                            Register
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
                            label="Name"
                            variant="outlined"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
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

                    <TextField 
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{ width: '80%' }}
                    />

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={register}
                        style={{ width: '80%' }}
                    >
                        Register
                    </Button>

                    <BackButton onClick={() => navigate('/welcome')}>Back</BackButton>
                </RegisterContainer>
            </BackgroundContainer>

            <ErrorPopUp isOpen={isErrorOpen} onClose={handleCloseError} message = {errorMsg}>
            </ErrorPopUp>
        </>
    )
}

export default Register;