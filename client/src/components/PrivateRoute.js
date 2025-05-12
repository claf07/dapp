import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to={`/${role}/login`} replace />;
  }

  if (user.role !== role) {
    // Wrong role, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute; 