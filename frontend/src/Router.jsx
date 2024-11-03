import React, { useState } from 'react';
import { Navigate, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Welcome from './page/Welcome';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import LogoutButton from './component/LogoutButton';

function MainApp() {

    const [token, setToken] = useState(localStorage.getItem('token'));

    const navigate = useNavigate();
    const location = useLocation();

    const handleNewToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        navigate('/dashboard');
    }

    React.useEffect(() => {
        if (token && ['/login', '/register'].includes(location.pathname)) {
            navigate('/dashboard');
        }

        if (!token && !(['/login', '/register']).includes(location.pathname)) {
            navigate('/welcome')
        }
    }, [token, location.pathname]);


    //Might need to refer to Dashboard if the token exists straight away

    return (
        <>
            <Routes>
                <Route path="/" element={<Welcome token={token} />} />
                <Route path="/welcome" element={<Welcome/> }/>
                <Route path="/register" element={<Register token={token} handleSuccess={handleNewToken} />} />
                <Route path="/login" element={<Login token={token} handleSuccess={handleNewToken}/>} />
                <Route path="/dashboard" element={<Dashboard token={token}/>}/>
            </Routes>
            {token && (
                <LogoutButton token={token} setToken={setToken} />
            )}
        </>
    )

}

export default MainApp