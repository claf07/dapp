'use client';
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ADMIN_WALLET = "0x123abc"; // Replace with actual admin wallet

export default function AdminLogin() {
  const { account } = useWeb3();
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      if (account?.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
        await login('admin@example.com', 'admin123');
        router.push('/admin/dashboard');
      } else {
        setError('Unauthorized wallet address');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Admin Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-900"
        >
          Login with Admin Wallet
        </button>
      </div>
    </div>
  );
}