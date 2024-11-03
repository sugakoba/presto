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

function Register({ token, handleSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isErrorOpen, setErrorOpen] = useState(false);
    const[errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    return (
        <>
            <h2>Register:</h2>
        </>
    )
}

export default Register;