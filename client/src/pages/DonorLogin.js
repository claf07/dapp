import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

function DonorLogin() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { account } = useWeb3();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!account) {
      setError('Please connect your wallet first');
      setLoading(false);
      return;
    }

    try {
      await login(mobileNumber, password, 'donor');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          Donor Login
        </h1>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            {account ? (
              <span className="text-green-600">Connected: {account}</span>
            ) : (
              <span className="text-red-600">Please connect your wallet to continue</span>
            )}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !account}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading || !account
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/donor/register"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Register as a Donor
            </Link>
          </p>
          <Link
            to="/"
            className="block text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DonorLogin; 