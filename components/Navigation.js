'use client';

import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';
import Link from 'next/link';

export default function Navigation() {
  const { account, connectWallet } = useWeb3();
  const { addNotification } = useNotification();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      addNotification('Failed to connect wallet', 'error');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Organ Donation
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/donor" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500">
                Donor
              </Link>
              <Link href="/patient" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500">
                Patient
              </Link>
              <Link href="/admin" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500">
                Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {account ? (
              <div className="text-sm text-gray-500">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 