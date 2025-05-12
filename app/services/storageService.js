'use client';

import { create } from 'ipfs-http-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletConnectModal } from '@walletconnect/modal';

class StorageService {
  constructor() {
    this.ipfs = null;
    this.litNodeClient = null;
    this.walletConnectProvider = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Initialize IPFS client
      this.ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
          ).toString('base64')}`
        }
      });

      // Initialize WalletConnect
      this.walletConnectProvider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        chains: [5], // Goerli testnet
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark'
        }
      });

      // Initialize Lit Protocol
      this.litNodeClient = new LitNodeClient({
        litNetwork: 'serrano',
        debug: false
      });

      await this.litNodeClient.connect();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing storage service:', error);
      throw error;
    }
  }

  async uploadToIPFS(data) {
    if (!this.initialized) await this.init();

    try {
      const result = await this.ipfs.add(JSON.stringify(data));
      return result.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  async getFromIPFS(hash) {
    if (!this.initialized) await this.init();

    try {
      const stream = this.ipfs.cat(hash);
      let data = '';
      for await (const chunk of stream) {
        data += chunk.toString();
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw error;
    }
  }

  async encryptAndStore(data, accessControlConditions) {
    if (!this.initialized) await this.init();

    try {
      const authSig = await this.litNodeClient.getSignedMessage({
        message: 'Sign this message to encrypt data',
        chain: 'ethereum',
        walletConnectProvider: this.walletConnectProvider
      });

      const { encryptedString, encryptedSymmetricKey } = await this.litNodeClient.encryptString(
        JSON.stringify(data),
        accessControlConditions,
        authSig
      );

      const ipfsHash = await this.uploadToIPFS({
        encryptedString,
        encryptedSymmetricKey
      });

      return ipfsHash;
    } catch (error) {
      console.error('Error encrypting and storing data:', error);
      throw error;
    }
  }

  async retrieveAndDecrypt(ipfsHash, accessControlConditions) {
    if (!this.initialized) await this.init();

    try {
      const { encryptedString, encryptedSymmetricKey } = await this.getFromIPFS(ipfsHash);

      const authSig = await this.litNodeClient.getSignedMessage({
        message: 'Sign this message to decrypt data',
        chain: 'ethereum',
        walletConnectProvider: this.walletConnectProvider
      });

      const decryptedString = await this.litNodeClient.decryptString(
        encryptedString,
        encryptedSymmetricKey,
        accessControlConditions,
        authSig
      );

      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error retrieving and decrypting data:', error);
      throw error;
    }
  }

  async storeMedicalRecords(records, patientAddress) {
    const accessControlConditions = [
      {
        contractAddress: process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT,
        standardContractType: 'ERC721',
        chain: 'ethereum',
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>',
          value: '0'
        }
      }
    ];

    return this.encryptAndStore(records, accessControlConditions);
  }

  async retrieveMedicalRecords(ipfsHash, patientAddress) {
    const accessControlConditions = [
      {
        contractAddress: process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT,
        standardContractType: 'ERC721',
        chain: 'ethereum',
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>',
          value: '0'
        }
      }
    ];

    return this.retrieveAndDecrypt(ipfsHash, accessControlConditions);
  }
}

export const storageService = new StorageService(); 