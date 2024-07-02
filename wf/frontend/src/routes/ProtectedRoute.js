import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAdmin } = useAuth();

  return isAdmin ? element : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
