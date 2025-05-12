'use client';

import { create } from 'ipfs-http-client';

class IPFSService {
  constructor() {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
        ).toString('base64')}`,
      },
    });
  }

  async uploadData(data) {
    try {
      const result = await this.ipfs.add(JSON.stringify(data));
      return result.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  async getData(hash) {
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

  async uploadEncryptedData(data, encryptionKey) {
    try {
      // Encrypt data before uploading
      const encryptedData = await this.encryptData(data, encryptionKey);
      const result = await this.ipfs.add(encryptedData);
      return result.path;
    } catch (error) {
      console.error('Error uploading encrypted data to IPFS:', error);
      throw error;
    }
  }

  async getEncryptedData(hash, encryptionKey) {
    try {
      const stream = this.ipfs.cat(hash);
      let encryptedData = '';
      for await (const chunk of stream) {
        encryptedData += chunk.toString();
      }
      // Decrypt data after retrieving
      const decryptedData = await this.decryptData(encryptedData, encryptionKey);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error retrieving encrypted data from IPFS:', error);
      throw error;
    }
  }

  async encryptData(data, key) {
    // Implement encryption logic here
    // This is a placeholder - you should use a proper encryption library
    return JSON.stringify(data);
  }

  async decryptData(encryptedData, key) {
    // Implement decryption logic here
    // This is a placeholder - you should use a proper encryption library
    return encryptedData;
  }
}

export const ipfsService = new IPFSService(); 