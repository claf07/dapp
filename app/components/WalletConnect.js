'use client';

import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';

export default function WalletConnect() {
  const { account, isConnecting, error, connectWallet, disconnectWallet } = useWeb3();
  const { showNotification } = useNotification();

  const handleConnect = async () => {
    try {
      await connectWallet();
      showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to connect wallet', 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    showNotification('Wallet disconnected', 'info');
  };

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isConnecting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {error && (
        <span className="text-sm text-red-600">
          {error}
        </span>
      )}
    </div>
  );
} 