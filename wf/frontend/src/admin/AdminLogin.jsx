import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './adminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password, 'admins');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className='loginContainer'>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='aname'>Username:</label>
          <input type="text" value={username} className="inputLabel" onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label className='adminPass'>Password:</label>
          <input type="password" value={password} className='inputLabel' onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className='adminSubmit'>Login</button>
      </form>
      <div className="westernFlex">
        <h>Western Flex</h>
    </div>
    </div>
  );
};

export default AdminLogin;
