import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter } from 'react-router-dom';
import MainApp from './Router';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
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
// also remember to npm install for new packages. 
// set up linting, test comes last. 


//If there is a library exists go use it. 
//Hayden week 8 Lecture from 1 hour 30mins till the end focuses on dashboard, 
//VERY USEFUl, only 15mins long.

