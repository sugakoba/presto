import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
            <h2>Welcome to presto </h2>

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
        </>
    )
}

export default Welcome;