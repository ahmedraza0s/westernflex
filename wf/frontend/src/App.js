import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'; // Ensure the path is correct and case-sensitive
import './components/navbar/navbar.css';        // Ensure the path is correct and case-sensitive
import Shop from './pages/Shop';      // Ensure the path is correct and case-sensitive
import ProductDetails from './pages/ProductDetails'; // Ensure the path is correct and case-sensitive

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:title" element={<ProductDetails />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
