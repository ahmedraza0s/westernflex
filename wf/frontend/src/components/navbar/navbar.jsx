import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import cartIcon from '../assets/cart.png';
import logo from '../assets/logo.jpg';
import { useCart } from '../../contexts/CartContext';
import Modal from '../Modal';
import Cart from '../../pages/Cart';
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch('/api/user', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (response.ok) {
              setUsername(data.username);
              localStorage.setItem('username', data.username);
            } else {
              localStorage.removeItem('token');
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
          }
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="social-icons">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        </div>
        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <FaBars />
        </button>
        <div className="navbar-brand">
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>
        <div className={`navbar-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="#">Contact Us</Link></li>
            {username ? (
              <li className="dropdown">
                <Link to="#" className="dropbtn">Hello, {username} <i className="fas fa-caret-down"></i></Link>
                <div className="dropdown-content">
                  <Link to="/account">Your Account</Link>
                  <Link to="/orders">Your Orders</Link>
                  <Link to="#" onClick={handleLogout}>Sign Out</Link>
                </div>
              </li>
            ) : (
              <li><Link to="/login">Hello, Sign in</Link></li>
            )}
          </ul>
        </div>
        <div className="cart-icon">
          <button onClick={() => setShowCartModal(true)}>
            <img src={cartIcon} alt="Cart" /><span>{cartCount}</span>
          </button>
        </div>
      </div>
      <Modal show={showCartModal} onClose={() => setShowCartModal(false)}>
        <Cart />
      </Modal>
    </nav>
  );
};

export default Navbar;
