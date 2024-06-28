import React, { useState } from 'react';
import './adminLogin.css';
import axios from 'axios'; // Import axios for making HTTP requests


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
      const { token } = response.data;
      // Store the token in localStorage or sessionStorage for subsequent requests
      localStorage.setItem('adminToken', token); // Example of storing token in localStorage
      console.log('Login successful');
      // Redirect to admin dashboard or perform other actions upon successful login
    } catch (error) {
      if (error.response) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError('Failed to login');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="loginContainer">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          className="uname"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="adminPass"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {loginError && <div className="error">{loginError}</div>}
        <input type="submit" value="Submit" />
      </form>
      <div className="westernFlex">
        <h2>Western Flex</h2>
      </div>
    </div>
  );
};

export default AdminLogin;
