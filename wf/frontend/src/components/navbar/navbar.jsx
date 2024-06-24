import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import cartIcon from '../assets/cart.png';

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    navigate('/');
  };

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
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="#">About Us</Link></li>
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
        <li className="cart-icon">
          <Link to="#"><img src={cartIcon} alt="Cart" /></Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
