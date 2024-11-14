import { Button, styled } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OutButton = styled(Button) `
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 4px;
    position: fixed;
    top: 10px;
    left: 10px;
`;

const LogoutButton = ({ token, setToken }) => {

  const navigate = useNavigate();

  const logout = () => {
    axios.post('http://localhost:5005/admin/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
      })
      .catch((error) => {
      });
  }
    
  return <OutButton onClick={logout}>Logout</OutButton>;

}

export default LogoutButton;