// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import './components/navbar/navbar.css';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './admin/AdminLogin'; // Import the AdminLogin component
import { UserProvider } from './contexts/UserContext'; // Import UserProvider from UserContext

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/product/:title" element={<ProductDetails />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
