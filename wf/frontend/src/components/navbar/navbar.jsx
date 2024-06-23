import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './navbar.css';
import cartIcon from '../assets/cart.png'; // Import the cart image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"><img src="logo.jpg" alt="Logo" /></Link>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <i className="fas fa-search"></i>
      </div>
      <ul className="navbar-nav">
        <li><Link to="">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="#">About Us</Link></li>
        <li><Link to="#">Contact Us</Link></li>
        <li className="dropdown">
          <Link to="/login" className="dropbtn">Hello, Sign in <i className="fas fa-caret-down"></i></Link>
          <div className="dropdown-content">
            <Link to="#">Your Account</Link>
            <Link to="#">Your Orders</Link>
            <Link to="#">Sign Out</Link>
          </div>
        </li>
        <li className="cart-icon">
          <Link to="#"><img src={cartIcon} alt="Cart" /></Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
