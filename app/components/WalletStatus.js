'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';

export default function WalletStatus() {
  const { account, chainId, connectWallet, disconnectWallet } = useWeb3();
  const { showNotification } = useNotification();
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account]);

  const fetchBalance = async () => {
    try {
      const provider = window.ethereum;
      if (provider) {
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        setBalance((parseInt(balance, 16) / 1e18).toFixed(4));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      showNotification('Wallet connected successfully', 'success');
    } catch (error) {
      showNotification('Failed to connect wallet', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectWallet();
      showNotification('Wallet disconnected successfully', 'success');
    } catch (error) {
      showNotification('Failed to disconnect wallet', 'error');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '1':
        return 'Ethereum Mainnet';
      case '3':
        return 'Ropsten Testnet';
      case '4':
        return 'Rinkeby Testnet';
      case '5':
        return 'Goerli Testnet';
      case '42':
        return 'Kovan Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case '1':
        return 'bg-green-100 text-green-800';
      case '3':
      case '4':
      case '5':
      case '42':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!account) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="space-y-4">
        {/* Account Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Connected Account</p>
              <p className="text-sm text-gray-500">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-sm text-red-600 hover:text-red-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>

        {/* Network Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Network</p>
            <p className="text-sm text-gray-500">{getNetworkName(chainId)}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNetworkColor(chainId)}`}>
            {chainId === '1' ? 'Mainnet' : 'Testnet'}
          </span>
        </div>

        {/* Balance Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Balance</p>
            <p className="text-sm text-gray-500">{balance} ETH</p>
          </div>
          <button
            onClick={fetchBalance}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Refresh
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            View on Etherscan
          </button>
          <button
            onClick={() => window.open('https://faucet.paradigm.xyz/', '_blank')}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Get Test ETH
          </button>
        </div>
      </div>
    </div>
  );
} 