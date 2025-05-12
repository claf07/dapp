import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token && userRole) {
      setUser({ token, role: userRole });
    }
    setLoading(false);
  }, []);

  const login = async (mobileNumber, password, role) => {
    try {
      // For admin, check hardcoded credentials
      if (role === 'admin') {
        if (mobileNumber === 'admin@example.com' && password === 'admin123') {
          const userData = { role: 'admin', token: 'admin-token' };
          localStorage.setItem('token', userData.token);
          localStorage.setItem('userRole', userData.role);
          setUser(userData);
          navigate('/admin/dashboard');
          return;
        }
        throw new Error('Invalid admin credentials');
      }

      // For donor and patient, make API call to backend
      const response = await axios.post('/api/auth/login', {
        mobileNumber,
        password,
        role
      });

      const userData = {
        token: response.data.token,
        role: response.data.role
      };

      localStorage.setItem('token', userData.token);
      localStorage.setItem('userRole', userData.role);
      setUser(userData);

      // Navigate based on role
      if (role === 'donor') {
        navigate('/donor/dashboard');
      } else if (role === 'patient') {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData, role) => {
    try {
      const response = await axios.post('/api/auth/register', {
        ...userData,
        role
      });

      // After successful registration, redirect to login
      navigate(`/${role}/login`);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}