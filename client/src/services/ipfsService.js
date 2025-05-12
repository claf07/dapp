import { create } from 'ipfs-http-client';

// Configure IPFS client
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const ipfsService = {
  // Upload file to IPFS
  async uploadFile(file) {
    try {
      const added = await client.add(file);
      return added.path;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  },

  // Upload JSON data to IPFS
  async uploadJSON(data) {
    try {
      const buffer = Buffer.from(JSON.stringify(data));
      const added = await client.add(buffer);
      return added.path;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  },

  // Get file from IPFS
  async getFile(hash) {
    try {
      const stream = client.cat(hash);
      let data = '';
      for await (const chunk of stream) {
        data += chunk.toString();
      }
      return data;
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      throw new Error('Failed to retrieve file from IPFS');
    }
  },

  // Get JSON data from IPFS
  async getJSON(hash) {
    try {
      const data = await this.getFile(hash);
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving JSON from IPFS:', error);
      throw new Error('Failed to retrieve JSON from IPFS');
    }
  },

  // Generate IPFS gateway URL
  getGatewayURL(hash) {
    return `https://ipfs.io/ipfs/${hash}`;
  },
}; 