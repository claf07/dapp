'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from './Web3Context';
import { useNotification } from './NotificationContext';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const { account } = useWeb3();
  const { showNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Sync wallet address with user data
    if (user && account) {
      const updatedUser = { ...user, walletAddress: account };
      setUser(updatedUser);
      Cookies.set('user', JSON.stringify(updatedUser));
    } else if (user && !account) {
      const updatedUser = { ...user, walletAddress: null };
      setUser(updatedUser);
      Cookies.set('user', JSON.stringify(updatedUser));
    }
  }, [account, user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Get stored users
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if it's an admin login
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          email: email,
          role: 'admin',
          name: 'Admin User',
          status: 'verified',
          walletAddress: account || null
        };

        try {
          // Create token
          const token = Buffer.from(JSON.stringify({
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
            status: adminUser.status
          })).toString('base64');

          // Store admin data
          localStorage.setItem('user', JSON.stringify(adminUser));
          localStorage.setItem('users', JSON.stringify([adminUser]));
          Cookies.set('token', token, { expires: 7 });

          // Update state
          setUser(adminUser);
          
          // Show success notification
          showNotification('Admin login successful!', 'success');
          
          return adminUser;
        } catch (error) {
          console.error('Admin login error:', error);
          throw new Error('Failed to complete admin login');
        }
      }

      // Regular user login
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (user.status === 'pending') {
        throw new Error('Your account is pending verification. Please wait for admin approval.');
      }

      if (user.status === 'rejected') {
        throw new Error('Your account has been rejected. Please contact support.');
      }

      // Create token
      const token = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      })).toString('base64');

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(user));
      Cookies.set('token', token, { expires: 7 });

      // Update state
      setUser(user);
      
      // Show success notification
      showNotification('Login successful!', 'success');
      
      // Return user
      return user;
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error.message || 'Login failed', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      const requiredFields = [
        'name', 'email', 'password', 'role', 'bloodGroup',
        'medicalHistory', 'address', 'phoneNumber', 'age',
        'gender', 'weight', 'height', 'walletAddress'
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = existingUsers.find(u => 
        u.email === userData.email || u.walletAddress === userData.walletAddress
      );

      if (existingUser) {
        throw new Error('User with this email or wallet address already exists');
      }

      // Create new user with pending status
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Store user data
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
    showNotification('Logged out successfully', 'success');
    router.push('/');
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Get users from storage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Update storage
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update token
      const token = Buffer.from(JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status
      })).toString('base64');
      Cookies.set('token', token, { expires: 7 });

      // Update state
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDonor: user?.role === 'donor',
    isPatient: user?.role === 'patient',
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 