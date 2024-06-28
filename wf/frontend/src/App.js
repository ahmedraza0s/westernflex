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
<<<<<<< HEAD
import AdminLogin from './admin/AdminLogin'; // Import the AdminLogin component
import { UserProvider } from './contexts/UserContext'; // Import UserProvider from UserContext
=======
import AdminLogin from './pages/admin/AdminLogin';
import Cart from './pages/Cart'; // Import the Cart component
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext'; 
>>>>>>> a12677f097cf23aecd85d7a7874465713c078534

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
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
            <Route path="/cart" element={<Cart />} /> {/* Add the Cart route */}
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
