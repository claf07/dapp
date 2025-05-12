'use client';

const Web3 = require('web3');

class ContractService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    this.contractABI = require('../build/contracts/OrganDonation.json').abi;
  }

  async init() {
    if (this.web3 && this.contract) return;

    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.web3 = new Web3(window.ethereum);
    } else {
      console.error('Please install MetaMask!');
    }

    this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
  }

  async registerDonor(donorData) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    const organs = [donorData.organ]; // Convert single organ to array
    const medicalRecordsHash = ''; // TODO: Implement IPFS integration

    return this.contract.methods
      .registerDonor(
        donorData.name,
        donorData.age,
        donorData.sex,
        donorData.height,
        donorData.weight,
        organs,
        donorData.bloodGroup,
        medicalRecordsHash
      )
      .send({ from: account });
  }

  async registerPatient(patientData) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    // Validate required fields
    if (!patientData.name || !patientData.age || !patientData.sex || !patientData.height || 
        !patientData.weight || !patientData.organ || !patientData.bloodGroup || 
        !patientData.mobileNumber || !patientData.emergencyLevel) {
      throw new Error('Missing required fields');
    }

    // Convert emergency level to number
    const emergencyLevelMap = {
      'normal': 0,
      'urgent': 1,
      'critical': 2
    };

    const emergencyLevel = emergencyLevelMap[patientData.emergencyLevel];
    if (emergencyLevel === undefined) {
      throw new Error('Invalid emergency level');
    }

    // Convert organs to array if it's not already
    const organs = Array.isArray(patientData.organ) ? patientData.organ : [patientData.organ];
    
    // Convert numeric values to strings for the contract
    const processedData = {
      name: patientData.name,
      age: patientData.age.toString(),
      sex: patientData.sex,
      height: patientData.height.toString(),
      weight: patientData.weight.toString(),
      organs: organs,
      bloodGroup: patientData.bloodGroup,
      mobileNumber: patientData.mobileNumber,
      emergencyLevel: emergencyLevel.toString()
    };

    // Log the data being sent to the contract
    console.log('Sending data to contract:', processedData);

    try {
      // First check if user already exists
      const userExists = await this.contract.methods.users(account).call();
      console.log('User exists check:', userExists);
      
      if (userExists && userExists.isRegistered) {
        throw new Error('This wallet address is already registered');
      }

      // Estimate gas to check for potential issues
      const gasEstimate = await this.contract.methods
        .registerPatient(
          processedData.name,
          processedData.age,
          processedData.sex,
          processedData.height,
          processedData.weight,
          processedData.organs,
          processedData.bloodGroup,
          '', // medicalRecordsHash - empty for now
          processedData.mobileNumber,
          processedData.emergencyLevel
        )
        .estimateGas({ from: account });
      
      console.log('Gas estimate:', gasEstimate);

      // Convert BigInt gas estimate to number and add 20% buffer
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

      // Send the transaction with increased gas limit
      return await this.contract.methods
        .registerPatient(
          processedData.name,
          processedData.age,
          processedData.sex,
          processedData.height,
          processedData.weight,
          processedData.organs,
          processedData.bloodGroup,
          '', // medicalRecordsHash - empty for now
          processedData.mobileNumber,
          processedData.emergencyLevel
        )
        .send({ 
          from: account,
          gas: gasLimit
        });
    } catch (error) {
      console.error('Contract error details:', {
        error,
        message: error.message,
        data: error.data,
        code: error.code,
        stack: error.stack
      });
      
      if (error.message.includes('user already exists') || error.message.includes('already registered')) {
        throw new Error('This wallet address is already registered');
      } else if (error.message.includes('gas required exceeds allowance')) {
        throw new Error('Transaction requires more gas than allowed');
      } else if (error.message.includes('execution reverted')) {
        throw new Error('Transaction was reverted by the contract. Please check your input data.');
      }
      throw error;
    }
  }

  async getDonorData(address) {
    await this.init();
    return this.contract.methods.users(address).call();
  }

  async getPatientData(address) {
    await this.init();
    return this.contract.methods.users(address).call();
  }

  async findMatch(patientAddress, organ) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .findMatch(patientAddress, organ)
      .send({ from: account });
  }

  async createEmergencyRequest(organ, emergencyLevel) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .createEmergencyRequest(organ, emergencyLevel)
      .send({ from: account });
  }

  async announceDonor() {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .announceDonor()
      .send({ from: account });
  }

  async getUsersByStatus(status) {
    await this.init();
    const addresses = await this.contract.methods.getUsersByStatus(status).call();
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async getUsersByRole(role) {
    await this.init();
    const addresses = await this.contract.methods.getUsersByRole(role).call();
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async getUsersByRoleAndStatus(role, status) {
    await this.init();
    const addresses = await this.contract.methods.getUsersByRoleAndStatus(role, status).call();
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async verifyDonor(donorAddress) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .verifyDonor(donorAddress)
      .send({ from: account });
  }

  async verifyPatient(patientAddress) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .verifyPatient(patientAddress)
      .send({ from: account });
  }

  async getPendingVerifications() {
    await this.init();
    const addresses = await this.contract.methods.getUsersByStatus(0).call(); // 0 = PENDING
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async getVerifiedUsers() {
    await this.init();
    const addresses = await this.contract.methods.getUsersByStatus(1).call(); // 1 = VERIFIED
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async getRejectedUsers() {
    await this.init();
    const addresses = await this.contract.methods.getUsersByStatus(2).call(); // 2 = REJECTED
    const users = await Promise.all(
      addresses.map(async (address) => {
        const userData = await this.contract.methods.users(address).call();
        return {
          address,
          ...userData,
        };
      })
    );
    return users;
  }

  async rejectUser(userAddress) {
    await this.init();
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    return this.contract.methods
      .rejectUser(userAddress)
      .send({ from: account });
  }
}

const contractService = new ContractService();
module.exports = { contractService }; 