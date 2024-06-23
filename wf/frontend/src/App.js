import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'; // Ensure the path is correct and case-sensitive
import './components/navbar/navbar.css';        // Ensure the path is correct and case-sensitive
import Shop from './pages/Shop';                // Ensure the path is correct and case-sensitive
import Home from './pages/Home';                // Ensure the path is correct and case-sensitive
import Checkout from './pages/Checkout';
import Login from './pages/Login';              // Ensure the path is correct and case-sensitive
import Register from './pages/Register';




const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />        {/* Default route */}
        <Route path="/home" element={<Home />} />    {/* Home route */}
        <Route path="/shop" element={<Shop />} />    {/* Shop route */}
        <Route path="/login" element={<Login />} />  {/* Login route */}
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/Checkout" element={<Checkout />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
