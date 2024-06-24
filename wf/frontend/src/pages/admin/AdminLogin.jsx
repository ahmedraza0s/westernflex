import React, { useState } from 'react';
import './adminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, such as making an API call
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="loginContainer">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
       
        <input
          type="text"
          id="username"
          className="uname"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
        
        <input
          type="password"
          id="password"
          className="adminPass"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input type="submit" value="Submit" />
      </form>
      <div className="westernFlex">
        <h2>Western Flex</h2>
      </div>
    </div>
  );
};

export default AdminLogin;
