import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import OrganDonationContract from '../contracts/OrganDonation.json';

const Web3Context = createContext();

export function useWeb3() {
  return useContext(Web3Context);
}

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Get network ID
          const networkId = await web3Instance.eth.net.getId();
          
          // Get deployed contract
          const deployedNetwork = OrganDonationContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            OrganDonationContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          console.error('Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const value = {
    web3,
    contract,
    account,
    loading
  };

  return (
    <Web3Context.Provider value={value}>
      {!loading && children}
    </Web3Context.Provider>
  );
} 