import React from 'react';
import Navbar from './components/navbar/Navbar'; // Ensure the path is correct and case-sensitive
import './components/navbar/navbar.css';        // Ensure the path is correct and case-sensitive
import { BrowserRouter,Routes,Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
     

      </BrowserRouter>
  
   
    </div>
  );
};

export default App;
