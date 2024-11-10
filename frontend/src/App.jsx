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
// Top bar Can be hidden away by panel - need help. 
// Clicked for text, model appear.
// Once clicked, send to Sever. Then edit the slide to make it appear. 
// Presentation: Soft grey border, Double click would allow to edit as above. 
// 
// set up linting, test comes last. 


//If there is a library exists go use it. \

