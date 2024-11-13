import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
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

export default App

//axios and react-router-dom has been set up, refer to package.json

//To run frontend it is: nvm use
//npm run dev
//port: 3000

//To run backend it is: nvm use
//npm start
//port: 5005

// TODO: 
// Need to have a functionality of check input. 
// Need to edit the width.
// Need to add double click. 
// Need to send to backend for image, video and code
// 
// set up linting, test comes last. 


//If there is a library exists go use it.

