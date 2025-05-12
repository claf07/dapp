'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export default function DemoMode() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const demoUsers = {
    admin: {
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    },
    donor: {
      email: 'demo-donor@example.com',
      password: 'demo123',
      role: 'donor',
    },
    patient: {
      email: 'demo-patient@example.com',
      password: 'demo123',
      role: 'patient',
    },
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    setSelectedRole(role);
    try {
      const demoUser = demoUsers[role];
      // Add demo user to localStorage if not exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.find(u => u.email === demoUser.email)) {
        const demoUserData = {
          ...demoUser,
          id: `demo-${role}-${Date.now()}`,
          name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          status: 'verified'
        };
        users.push(demoUserData);
        localStorage.setItem('users', JSON.stringify(users));
      }

      const response = await login(demoUser.email, demoUser.password);
      showNotification(`Welcome to the ${role} demo!`, 'success');
      router.push(`/${role}/dashboard`);
    } catch (error) {
      showNotification(error.message || 'Demo login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Try Our Platform</h2>
          <p className="mt-2 text-sm text-gray-600">
            Experience the platform features without connecting your wallet
          </p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Object.entries(demoUsers).map(([role, user]) => (
              <div key={role} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{role} Demo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Experience {role} features
                  </p>
                  <button
                    onClick={() => handleDemoLogin(role)}
                    disabled={isLoading}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading && selectedRole === role ? 'Loading...' : `Try ${role} Demo`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}