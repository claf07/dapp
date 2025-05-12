'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NotificationContext } from './NotificationContext';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const notificationContext = useContext(NotificationContext);

  const showNotification = (message, type) => {
    if (notificationContext?.showNotification) {
      notificationContext.showNotification(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || null);
            showNotification(
              accounts[0] ? 'Account changed' : 'Please connect your wallet',
              accounts[0] ? 'success' : 'warning'
            );
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });
        } else {
          showNotification('Please install MetaMask to use this application', 'warning');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
        showNotification('Failed to initialize Web3', 'error');
      } finally {
        setLoading(false);
      }
    };

    initWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showNotification('Please install MetaMask to use this application', 'warning');
        return;
      }

      await checkUserRole();
      await loadContractData();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        showNotification('No accounts found. Please unlock your wallet.', 'warning');
        return;
      }

      setAccount(accounts[0]);
      showNotification('Wallet connected successfully', 'success');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        showNotification('Please connect your wallet to continue', 'warning');
      } else {
        showNotification('Failed to connect wallet. Please try again.', 'error');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    showNotification('Wallet disconnected', 'info');
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        loading,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 