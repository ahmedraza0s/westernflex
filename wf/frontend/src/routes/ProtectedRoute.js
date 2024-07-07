import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element, isAdminRoute }) => {
  const { isAdmin, isAuthenticated } = useAuth();

  if (isAdminRoute) {
    return isAdmin ? element : <Navigate to="/admin-login" />;
  } else {
    return isAuthenticated ? element : <Navigate to="/admin-login" />;
  }
};

export default ProtectedRoute;
