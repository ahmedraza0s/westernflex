import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setIsAdmin(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
