import { BrowserRouter } from 'react-router-dom';
import MainApp from './Router';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  
  return (
    <>
      <CssBaseline>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </CssBaseline>
    </>
  )
}

export default App;

