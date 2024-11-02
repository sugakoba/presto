import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography } from "@mui/material";


function Login({ token, handleSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

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
        width: 300px;
        display: flex;
        flex-direction: column;
    `;

    const login = () => {
        axios.post('http://localhost:5005/admin/auth/login', {
            email: email,
            password: password,
        })
        .then(function (response) {
            handleSuccess(response.data.token);
        }) 
        .catch(function (error) {
            alert(error.response.data.error);
        });
    }


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
                    />

                    <TextField 
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={login}    
                    >
                        Login
                    </Button>
                </LoginContainer>

            </BackgroundContainer>
        </>
    )
}

export default Login;