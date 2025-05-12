import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

function LandingPage() {
  const { account } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Organ Donation Platform
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            {account ? (
              <span className="text-green-600">Connected: {account}</span>
            ) : (
              <span className="text-red-600">Please connect your wallet to continue</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Login Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin</h2>
            <p className="text-gray-600 mb-6">
              Access the admin dashboard to verify and manage organ donation requests.
            </p>
            <Link
              to="/admin/login"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>

          {/* Donor Login Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Donor</h2>
            <p className="text-gray-600 mb-6">
              Register as an organ donor or manage your existing donation pledge.
            </p>
            <div className="space-y-3">
              <Link
                to="/donor/login"
                className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Donor Login
              </Link>
              <Link
                to="/donor/register"
                className="block w-full text-center bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 transition-colors"
              >
                New Donor Registration
              </Link>
            </div>
          </div>

          {/* Patient Login Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient</h2>
            <p className="text-gray-600 mb-6">
              Register as a patient in need of an organ or manage your existing request.
            </p>
            <div className="space-y-3">
              <Link
                to="/patient/login"
                className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Patient Login
              </Link>
              <Link
                to="/patient/register"
                className="block w-full text-center bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 transition-colors"
              >
                New Patient Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 