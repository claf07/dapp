'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export default function Demo() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const demoUsers = {
    admin: {
      email: 'demo-admin@example.com',
      password: 'demo123',
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
      const response = await login(demoUser.email, demoUser.password, true); // true for demo mode

      if (response && response.success) {
        showNotification(`Welcome to the ${role} demo!`, 'success');
        router.push(`/${role}/dashboard`);
      } else {
        showNotification(response?.message || 'Demo login failed', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'An error occurred during demo login', 'error');
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
            {/* Admin Demo Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Admin Demo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Experience platform management features
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                  <li>• User verification</li>
                  <li>• Donation management</li>
                  <li>• Platform analytics</li>
                  <li>• System settings</li>
                </ul>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading && selectedRole === 'admin' ? 'Loading...' : 'Try Admin Demo'}
                </button>
              </div>
            </div>

            {/* Donor Demo Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Donor Demo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Experience organ donation features
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                  <li>• Register organs</li>
                  <li>• View matches</li>
                  <li>• Update profile</li>
                  <li>• View legacy NFT</li>
                </ul>
                <button
                  onClick={() => handleDemoLogin('donor')}
                  disabled={isLoading}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading && selectedRole === 'donor' ? 'Loading...' : 'Try Donor Demo'}
                </button>
              </div>
            </div>

            {/* Patient Demo Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Patient Demo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Experience organ request features
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                  <li>• Request organs</li>
                  <li>• View matches</li>
                  <li>• Upload records</li>
                  <li>• Track status</li>
                </ul>
                <button
                  onClick={() => handleDemoLogin('patient')}
                  disabled={isLoading}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading && selectedRole === 'patient' ? 'Loading...' : 'Try Patient Demo'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Demo Mode Features</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  In demo mode, you can explore all platform features with pre-configured demo accounts.
                  No wallet connection is required, and all blockchain interactions are simulated.
                </p>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    All features are fully functional but operate in a simulated environment
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Demo data is reset periodically to ensure a fresh experience
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Perfect for exploring the platform before committing to registration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
