import React, { useState } from 'react';
import { Navigate, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Welcome from './page/Welcome';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Presentation from './page/Presentation';
import LogoutButton from './component/LogoutButton';
import Preview from './component/Preview';

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

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome token={token} />} />
        <Route path="/welcome" element={<Welcome/> }/>
        <Route path="/register" element={<Register token={token} handleSuccess={handleNewToken} />} />
        <Route path="/login" element={<Login token={token} handleSuccess={handleNewToken}/>} />
        <Route path="/dashboard" element={<Dashboard token={token}/>}/>
        <Route path="/dashboard/:presentationId/:slideNumber?" element={<Presentation token={token}/>} />
        <Route path="/dashboard/:presentationId/preview/:slideNumber?" element={<Preview token={token}/>} />
      </Routes>
      {token && (
        <LogoutButton token={token} setToken={setToken} />
      )}
    </>
  )

}

export default MainApp