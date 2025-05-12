'use client';
import { useWeb3 } from './contexts/Web3Context';
import Link from 'next/link';

export default function LandingPage() {
  const { account, connectWallet } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Organ Donation DApp
        </h1>

        {!account ? (
          <div className="text-center mb-6">
            <button
              onClick={connectWallet}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Link href="/donor/login">
              <div className="block w-full bg-green-600 text-white text-center rounded-lg px-4 py-3 hover:bg-green-700 transition-colors">
                Login as Donor
              </div>
            </Link>

            <Link href="/patient/login">
              <div className="block w-full bg-purple-600 text-white text-center rounded-lg px-4 py-3 hover:bg-purple-700 transition-colors">
                Login as Recipient
              </div>
            </Link>

            <Link href="/admin/login">
              <div className="block w-full bg-gray-800 text-white text-center rounded-lg px-4 py-3 hover:bg-gray-900 transition-colors">
                Admin Login
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}