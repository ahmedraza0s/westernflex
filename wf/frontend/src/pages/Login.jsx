import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import loginIcon from '../components/assets/loginuser.png';
import googleIcon from '../components/assets/google.png';
import facebookIcon from '../components/assets/facebook.png';
import twitterIcon from '../components/assets/twitter.png';
import userIcon from '../components/assets/user1.png';
import passwordIcon from '../components/assets/password.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [username, setUsername] = useState(''); // State to store username
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUsername(formData.username); // Store username
        setIsLoggedIn(true); // Set login status to true
        navigate('/');
        window.location.reload(); // Refresh the page
      } else {
        setError(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error logging in user');
    }
  };

  // Function to handle sign-in button click
  const handleSignInClick = () => {
    setIsLoggedIn(true); // Set login status to true
  };

  // Function to handle sign-out button click
  const handleSignOut = () => {
    setIsLoggedIn(false); // Set login status to false
    setUsername(''); // Clear username
  };

  return (
    <div className="main">
      <section className="sign-in">
        <div className="login-container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <Link to="#"><img src={userIcon} alt="sign up" /></Link>
              </figure>
              {isLoggedIn ? (
                <span className="signup-image-link">Hello, {username}</span>
              ) : (
                <Link to="/register" className="signup-image-link">Create an account</Link>
              )}
            </div>

            <div className="signin-form">
              <h2 className="form-title">Sign-in</h2>
              <form method="post" className="register-form" id="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <Link to="#"><img src={loginIcon} alt="user" className="img" /></Link>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    className="input2"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passwordIcon} alt="password" className="img" /></Link>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="input2"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="forget">
                  <Link to="#"><h>Forget Password</h></Link>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit"
                    value="Log in"
                    onClick={handleSignInClick}
                  />
                </div>
              </form>

              <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li><Link to="#"><img src={googleIcon} alt="google" className="social-logo" /></Link></li>
                  <li><Link to="#"><img src={facebookIcon} alt="facebook" className="social-logo" /></Link></li>
                  <li><Link to="#"><img src={twitterIcon} alt="twitter" className="social-logo" /></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
