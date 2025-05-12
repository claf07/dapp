'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNotification } from './NotificationContext';
import { contractService } from '../services/contractService';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const connectWallet = async () => {
    try {
      await contractService.init(); // Ensure this is called first
      const accounts = await contractService.web3.eth.getAccounts();
      setAccount(accounts[0]);
      setWeb3(contractService.web3);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const disconnectWallet = () => {
    setAccount(null);
  };

  const value = {
    web3,
    account,
    contract,
    loading,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context); 